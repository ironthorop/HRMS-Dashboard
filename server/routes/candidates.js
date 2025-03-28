const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { fileURLToPath } = require("url");
const Candidate = require("../models/Candidate");
const Employee = require("../models/Employee");

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/resumes");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "resume-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

// @route   GET /api/candidates
// @desc    Get all candidates with pagination and filters
// @access  Private
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filterQuery.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { position: searchRegex },
      ];
    }

    if (req.query.status && req.query.status !== "all") {
      filterQuery.status = req.query.status;
    }

    if (req.query.department && req.query.department !== "all") {
      filterQuery.department = req.query.department;
    }

    // Build sort query
    let sortQuery = { createdAt: -1 }; // Default: newest first

    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case "oldest":
          sortQuery = { createdAt: 1 };
          break;
        case "name_asc":
          sortQuery = { name: 1 };
          break;
        case "name_desc":
          sortQuery = { name: -1 };
          break;
        default:
          sortQuery = { createdAt: -1 };
      }
    }

    // Execute query with pagination
    const candidates = await Candidate.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalItems = await Candidate.countDocuments(filterQuery);

    res.json({
      candidates,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/candidates
// @desc    Create a new candidate
// @access  Private
router.post("/", upload.single("resume"), async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      department,
      experience,
      skills,
      education,
      status,
      notes,
    } = req.body;

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res
        .status(400)
        .json({ message: "Candidate already exists with this email" });
    }

    // Create new candidate
    const candidate = new Candidate({
      name,
      email,
      phone,
      position,
      department,
      experience: experience || 0,
      skills: skills ? JSON.parse(skills) : [],
      education: education ? JSON.parse(education) : [],
      status: status || "new",
      notes,
      resume: req.file ? `/uploads/resumes/${req.file.filename}` : "",
      createdBy: req.user.id,
    });

    await candidate.save();

    res.status(201).json({
      message: "Candidate created successfully",
      candidate,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/candidates/:id
// @desc    Get candidate by ID
// @access  Private
router.get("/:id", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/candidates/:id
// @desc    Update candidate
// @access  Private
router.put("/:id", upload.single("resume"), async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      department,
      experience,
      skills,
      education,
      status,
      notes,
    } = req.body;

    // Find candidate
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Update fields
    candidate.name = name || candidate.name;
    candidate.email = email || candidate.email;
    candidate.phone = phone || candidate.phone;
    candidate.position = position || candidate.position;
    candidate.department = department || candidate.department;
    candidate.experience = experience || candidate.experience;
    candidate.skills = skills ? JSON.parse(skills) : candidate.skills;
    candidate.education = education
      ? JSON.parse(education)
      : candidate.education;
    candidate.status = status || candidate.status;
    candidate.notes = notes || candidate.notes;

    // Update resume if new file is uploaded
    if (req.file) {
      // Delete old resume if exists
      if (candidate.resume) {
        const oldResumePath = path.join(__dirname, "..", candidate.resume);
        if (fs.existsSync(oldResumePath)) {
          fs.unlinkSync(oldResumePath);
        }
      }

      candidate.resume = `/uploads/resumes/${req.file.filename}`;
    }

    await candidate.save();

    res.json({
      message: "Candidate updated successfully",
      candidate,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/candidates/:id
// @desc    Delete candidate
// @access  Private
router.delete("/:id", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Delete resume file if exists
    if (candidate.resume) {
      const resumePath = path.join(__dirname, "..", candidate.resume);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    await candidate.remove();

    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/candidates/:id/convert-to-employee
// @desc    Convert candidate to employee
// @access  Private
router.post("/:id/convert-to-employee", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (candidate.status !== "selected") {
      return res
        .status(400)
        .json({
          message: "Only selected candidates can be converted to employees",
        });
    }

    // Generate employee ID
    const employeeCount = await Employee.countDocuments();
    const employeeId = `EMP${(employeeCount + 1).toString().padStart(4, "0")}`;

    // Create new employee from candidate data
    const employee = new Employee({
      name: candidate.name,
      email: candidate.email,
      employeeId,
      phone: candidate.phone,
      position: candidate.position,
      department: candidate.department,
      joiningDate: new Date(),
      salary: 0, // Default value, to be updated later
      status: "active",
      documents: [
        {
          name: "Resume",
          path: candidate.resume,
          uploadDate: new Date(),
        },
      ],
      createdBy: req.user.id,
    });

    await employee.save();

    // Update candidate status
    candidate.status = "selected";
    await candidate.save();

    res.status(201).json({
      message: "Candidate successfully converted to employee",
      employee,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/candidates/:id/download-resume
// @desc    Download candidate resume
// @access  Private
router.get("/:id/download-resume", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (!candidate.resume) {
      return res
        .status(404)
        .json({ message: "Resume not found for this candidate" });
    }

    const resumePath = path.join(__dirname, "..", candidate.resume);

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    res.download(resumePath);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
