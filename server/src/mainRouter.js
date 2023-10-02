const express = require("express");
const router = express.Router();

router.use("/member", require("./route/member"));
router.use("/terms", require("./route/terms"));
router.use("/resource", require("./route/resource"));
router.use("/igv", require("./route/igv"));
router.use("/event", require("./route/events"));
router.use("/email", require("./route/email"));
router.use("/ogv", require("./route/ogv_applicant"));

module.exports = router;
