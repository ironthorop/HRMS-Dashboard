require("dotenv").config(); // Ensure this is at the top of the file
const express = require("express");
const apiRoutes = require("./routes/api.route.js");
const leaveRoutes = require("./routes/leaveRoutes");
const connectDB = require("./config/db.js");

const app = express();
connectDB();
// Middleware
app.use((req, res, next) => {
  const allowedOrigins = [process.env.FE1, process.env.FE2, process.env.FE3];
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  } else {
    res.status(403).send("Not allowed by CORS");
  }
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Middleware to handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON:", err.message);
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next(err);
});

// Routes
app.use("/api", apiRoutes);
app.use("/api/leaves", leaveRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
