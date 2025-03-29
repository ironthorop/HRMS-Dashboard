const router = require("express").Router();
const authRoute = require("./auth");
const candidateRoute = require("./candidates.route");
const employeeRoute = require("./employees.route");

router.use("/auth", authRoute);
router.use("/candidates", candidateRoute);
router.use("/employees", employeeRoute);

module.exports = router;
