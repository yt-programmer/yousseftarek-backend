const express = require("express");
const router = express.Router();
const httpStatus = require("../utils/httpStatus");
const { login } = require("../controllers/admin.controller");
const verifyToken = require("../middlewares/verifyToken");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { body } = require("express-validator");
const validationResultMiddleware = require("../middlewares/validationResultMiddleware");
router
  .route("/login")
  .post(
    [
      body("email").not().isEmpty().withMessage("Email is required"),
      body("password").not().isEmpty().withMessage("Password is required"),
    ],
    validationResultMiddleware,
    login,
  );
router.route("/me").get(
  verifyToken,
  asyncWrapper(async (req, res) => {
    res.json({
      status: httpStatus.SUCCESS,
      data: { admin: req.admin },
    });
  }),
);

module.exports = router;
