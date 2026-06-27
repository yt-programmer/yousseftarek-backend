const express = require("express");
const router = express.Router();

const { sendContactEmail } = require("../controllers/sendMail.controller");

const { body } = require("express-validator");
const validationResultMiddleware = require("../middlewares/validationResultMiddleware");
router
  .route("/")
  .post(
    [
      body("name").not().isEmpty().withMessage("Name is required"),
      body("email")
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
      body("message").not().isEmpty().withMessage("Message is required"),
    ],
    validationResultMiddleware,
    sendContactEmail,
  );

module.exports = router;
