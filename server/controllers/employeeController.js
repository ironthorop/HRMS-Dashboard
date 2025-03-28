const Employee = require("../models/Employee");
const Candidate = require("../models/Candidate");

// @desc    Get all employees with pagination and filters
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
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
        { employeeId: searchRegex },
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
    const employees = await Employee.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalItems = await Employee.countDocuments(filterQuery);

    res.json({
      employees,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      phone,
      position,
      department,
      joiningDate,
      salary,
      status,
      address,
      emergencyContact,
      bankDetails,
    } = req.body;

    // Check if employee already exists with the same email or employeeId
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee already exists with this email or employee ID",
      });
    }

    // Create new employee
    const employee = new Employee({
      name,
      email,
      employeeId,
      phone,
      position,
      department,
      joiningDate,
      salary,
      status: status || "active",
      address,
      emergencyContact,
      bankDetails,
      createdBy: req.user.id,
    });

    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      department,
      joiningDate,
      salary,
      status,
      address,
      emergencyContact,
      bankDetails,
    } = req.body;

    // Find employee
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if email is being changed and if it already exists
    if (email !== employee.email) {
      const existingEmail = await Employee.findOne({ email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Email already in use by another employee" });
      }
    }

    // Update fields
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.position = position || employee.position;
    employee.department = department || employee.department;
    employee.joiningDate = joiningDate || employee.joiningDate;
    employee.salary = salary || employee.salary;
    employee.status = status || employee.status;

    // Update nested objects if provided
    if (address) {
      employee.address = {
        ...employee.address,
        ...address,
      };
    }

    if (emergencyContact) {
      employee.emergencyContact = {
        ...employee.emergencyContact,
        ...emergencyContact,
      };
    }

    if (bankDetails) {
      employee.bankDetails = {
        ...employee.bankDetails,
        ...bankDetails,
      };
    }

    await employee.save();

    res.json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.remove();

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update employee status
// @route   PATCH /api/employees/:id/status
// @access  Private
const updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive", "on_leave", "terminated"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.status = status;
    await employee.save();

    res.json({
      message: "Employee status updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Generate a new employee ID
// @route   GET /api/employees/generate-id
// @access  Private
const generateEmployeeId = async (req, res) => {
  try {
    const employeeCount = await Employee.countDocuments();
    const employeeId = `EMP${(employeeCount + 1).toString().padStart(4, "0")}`;

    res.json({ employeeId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Convert candidate to employee
// @route   POST /api/candidates/:id/convert-to-employee
// @access  Private
const convertCandidateToEmployee = async (req, res) => {
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  generateEmployeeId,
  convertCandidateToEmployee,
};
