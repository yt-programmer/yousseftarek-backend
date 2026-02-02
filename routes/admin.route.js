const express = require("express");
const router = express.Router();
const httpStatus = require("../utils/httpStatus");
const { login } = require("../controllers/admin.controller");
const verifyToken = require("../middlewares/verifyToken");
const asyncWrapper = require("../middlewares/asyncWrapper");
router.route("/login").post(login);
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
