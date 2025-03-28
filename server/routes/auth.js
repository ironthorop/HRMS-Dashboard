const express = require("express");
const authenticate = require("../middleware/authMiddleware.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", authController.login);

// @route   GET /api/auth/verify
// @desc    Verify token and get user data
// @access  Private
router.get("/verify", authenticate, authController.verify);

module.exports = router;
