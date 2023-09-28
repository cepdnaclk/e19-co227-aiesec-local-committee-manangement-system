const express = require("express");
const router = express.Router();

router.use("/projects", require("./projects"));
router.use("/slots", require("./slots"));
router.use("/questions", require("./questions"));
router.use("/applications", require("./applications"));
// router.use("/interview_log", require("./interview_log"));

module.exports = router;
