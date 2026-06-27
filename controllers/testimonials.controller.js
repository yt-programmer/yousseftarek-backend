const Testimonials = require("../models/testimonials.model");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatus = require("../utils/httpStatus");
const appError = require("../utils/appError");
const getTestimonials = asyncWrapper(async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const testimonials = await Testimonials.find({}, { __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { testimonials },
  });
});

const createTestimonial = asyncWrapper(async (req, res) => {
  const { name, position, rating, description } = req.body;
  const testimonial = await new Testimonials({
    name,
    position,
    rating,
    description,
  });

  await testimonial.save();
  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { testimonial },
  });
});

const editTestimonial = asyncWrapper(async (req, res) => {
  const { name, position, rating, description } = req.body;
  const testimonial = await Testimonials.findByIdAndUpdate(
    req.params.id,
    { name, position, rating, description },
    { new: true, runValidators: true },
  );
  if (!testimonial) {
    return next(appError.create("Testimonial not found", 404, httpStatus.FAIL));
  }
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { testimonial },
  });
});
const deleteTestimonial = asyncWrapper(async (req, res) => {
  const testimonial = await Testimonials.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    return next(appError.create("Testimonial not found", 404, httpStatus.FAIL));
  }
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { testimonial },
  });
});

module.exports = {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
  editTestimonial,
};
