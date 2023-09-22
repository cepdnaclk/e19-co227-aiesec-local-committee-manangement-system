const express = require("express");
const router = express.Router();


router.use("/member", require("./route/member"));
router.use("/terms", require("./route/terms"));
router.use("/resource", require("./route/resource"));
router.use("/project", require("./route/igv_projects"));
router.use("/slot", require("./route/igv_slots"));
router.use("/question", require("./route/igv_question"));
router.use("/application", require("./route/igv_application"));
router.use("/event", require("./route/events"));
router.use("/email", require("./route/email"));
router.use("/ogv", require("./route/ogv_applicant"));


module.exports = router;