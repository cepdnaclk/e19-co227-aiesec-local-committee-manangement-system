const express = require("express");
const router = express.Router();

router.use("/member", require("./route/member"));
router.use("/terms", require("./route/terms"));
router.use("/resource", require("./route/resource"));
router.use("/igv", require("./route/igv"));
router.use("/events", require("./route/events"));
router.use("/email", require("./route/email"));
router.use("/ogv", require("./route/ogv"));
router.use("/pm", require("./route/pm"));
module.exports = router;
