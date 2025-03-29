const path = require("path");
const Candidate = require("../models/Candidate");
const Employee = require("../models/Employee");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
  return await cloudinary.uploader.upload(file, {
    folder: "resumes",
    resource_type: "auto",
  });
};

// Get all candidates with pagination and filters
exports.getAllCandidates = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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

    const sortQuery =
      req.query.sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const candidates = await Candidate.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

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
};

// Create a new candidate
exports.createCandidate = async (req, res, next) => {
  try {
    const { name, email, phone, position, experience } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !position) {
      return res.status(400).json({
        message: "All fields (name, email, phone, and position) are mandatory.",
      });
    }

    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res
        .status(400)
        .json({ message: "Candidate already exists with this email" });
    }

    let resumeUrl = "";
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      resumeUrl = uploadResult.secure_url;
    }

    const candidate = new Candidate({
      name,
      email,
      phone,
      position,
      experience: experience || 0,
      resume: resumeUrl,
    });

    await candidate.save();
    res
      .status(201)
      .json({ message: "Candidate created successfully", candidate });
  } catch (error) {
    next(error);
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    next(error);
  }
};

exports.convertToEmployee = async (candidate) => {
  const employeeCount = await Employee.countDocuments();
  const employeeId = `EMP${(employeeCount + 1).toString().padStart(4, "0")}`;

  const employee = new Employee({
    name: candidate.name,
    email: candidate.email,
    employeeId,
    phone: candidate.phone,
    position: candidate.position,
    joiningDate: new Date(),
    status: "active",
  });

  await employee.save();
  await Candidate.findByIdAndRemove(candidate._id);
  return employee;
};

// Update candidate
exports.updateCandidate = async (req, res, next) => {
  try {
    const { name, email, phone, position, experience, status } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !position) {
      return res.status(400).json({
        message: "All fields (name, email, phone, and position) are mandatory.",
      });
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Update fields
    candidate.name = name || candidate.name;
    candidate.email = email || candidate.email;
    candidate.phone = phone || candidate.phone;
    candidate.position = position || candidate.position;
    candidate.experience = experience || candidate.experience;

    // Check if status is updated to "selected"
    if (status === "Selected" && candidate.status !== "selected") {
      const employee = await exports.convertToEmployee(candidate);
      return res.json({
        message: "Candidate converted to employee and removed from candidates.",
        employee,
      });
    }

    candidate.status = status || candidate.status;
    await candidate.save();

    res.json({ message: "Candidate updated successfully", candidate });
  } catch (error) {
    next(error);
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Optionally, delete the file from Cloudinary (if needed)
    // Extract the public_id from the resume URL and delete it
    if (candidate.resume) {
      const publicId = candidate.resume.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`resumes/${publicId}`);
    }

    await candidate.remove();
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Download candidate resume
exports.downloadResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid candidate ID format" });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate || !candidate.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Validate the resume URL
    if (!candidate.resume.startsWith("http")) {
      return res.status(400).json({ message: "Invalid resume URL" });
    }

    // Redirect to the Cloudinary URL for the resume
    res.redirect(candidate.resume);
  } catch (error) {
    next(error);
  }
};
