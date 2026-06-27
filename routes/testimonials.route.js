const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
  editTestimonial,
} = require("../controllers/testimonials.controller");
const { body, query, param } = require("express-validator");

const validationResultMiddleware = require("../middlewares/validationResultMiddleware");

router
  .route("/")
  .get(
    [
      query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
      query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    ],
    validationResultMiddleware,
    getTestimonials,
  )
  .post(
    verifyToken,
    [
      body("name").not().isEmpty().withMessage("Name is required"),
      body("position").not().isEmpty().withMessage("Position is required"),
      body("rating")
        .not()
        .isEmpty()
        .isNumeric()
        .withMessage("Rating must be a number"),
      body("description")
        .not()
        .isEmpty()
        .withMessage("Description is required"),
    ],
    validationResultMiddleware,

    createTestimonial,
  );

router
  .route("/:id")
  .patch(
    verifyToken,
    [
      body("name").not().isEmpty().withMessage("Name is required").optional(),
      body("position")
        .not()
        .isEmpty()
        .withMessage("Position is required")
        .optional(),
      body("rating")
        .not()
        .isEmpty()
        .isNumeric()
        .withMessage("Rating must be a number")
        .optional(),
      body("description")
        .not()
        .isEmpty()
        .withMessage("Description is required")
        .optional(),
      param("id").isMongoId().withMessage("Invalid ID format"),
    ],
    validationResultMiddleware,
    editTestimonial,
  )
  .delete(
    verifyToken,
    [param("id").isMongoId().withMessage("Invalid ID format")],
    validationResultMiddleware,
    deleteTestimonial,
  );

module.exports = router;
