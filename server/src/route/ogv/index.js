const express = require("express");
const router = express.Router();

router.use("/applicants", require("./applicants"));

module.exports = router;
