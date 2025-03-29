const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const Employee = require("../models/Employee"); // Added Employee model

// Get all leaves
router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee")
      .populate("approvedBy");
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new leave
router.post("/", async (req, res) => {
  try {
    const { employee } = req.body;

    // Ensure only "Present" employees can take leaves
    const emp = await Employee.findById(employee);
    if (!emp || emp.status !== "Present") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Only 'Present' employees can take leaves.",
        });
    }

    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json({ success: true, leave });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update leave status
router.put("/:id", async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, leave });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a leave
router.delete("/:id", async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Leave deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Download leave document
router.get("/:id/docs/:docId", async (req, res) => {
  try {
    const { id, docId } = req.params;
    const leave = await Leave.findById(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    const doc = leave.docs.find((d) => d._id.toString() === docId);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    res.redirect(doc.url);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
