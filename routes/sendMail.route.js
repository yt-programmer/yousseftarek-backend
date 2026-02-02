const express = require("express");
const router = express.Router();

const { sendContactEmail } = require("../controllers/sendMail.controller");

router.route("/").post(sendContactEmail);

module.exports = router;
