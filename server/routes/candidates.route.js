const express = require("express");
const multer = require("multer");
const {
  getAllCandidates,
  createCandidate,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  convertToEmployee,
  downloadResume,
} = require("../controllers/candidateController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for file uploads

// Routes
router.get("/", getAllCandidates);
router.post("/", upload.single("resume"), createCandidate);
router.get("/:id", getCandidateById);
router.put("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);
router.post("/:id/convert-to-employee", convertToEmployee);
router.get("/:id/download-resume", downloadResume);

module.exports = router;
