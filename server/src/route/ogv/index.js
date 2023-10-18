const express = require("express");
const router = express.Router();

router.use("/applicants", require("./applicants"));
router.use("/emails", require("./email"));
module.exports = router;
