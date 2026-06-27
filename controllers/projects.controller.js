const httpStatus = require("../utils/httpStatus");

const Project = require("../models/project.model");

const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getProjects = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 10, filter } = req.query;
  const skip = (page - 1) * limit;

  const query = {};

  if (filter && filter?.trim().toLowerCase() !== "all") {
    query.filter = filter.trim().toLowerCase();
  }
  const projects = await Project.find(query, { __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const filters = await Project.distinct("filter");
  res.json({
    status: httpStatus.SUCCESS,
    data: { projects, filters },
  });
});

const createProject = asyncWrapper(async (req, res, next) => {
  const { title, description, image, link, skils, filter } = req.body;

  const project = new Project({
    title,
    description,
    image,
    link,
    skils,
    filter: filter?.trim().toLowerCase(),
  });
  await project.save();

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { project },
  });
});
const editProject = asyncWrapper(async (req, res, next) => {
  const { title, description, image, link, skils, filter } = req.body;
  const updateData = {
    title,
    description,
    image,
    link,
    skils,
  };

  if (filter) {
    updateData.filter = filter.trim().toLowerCase();
  }

  const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(appError.create("Project not found", 404, httpStatus.FAIL));
  }

  res.json({
    status: httpStatus.SUCCESS,
    data: { project },
  });
});

const deleteProject = asyncWrapper(async (req, res, next) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id });
  if (!project) {
    return next(appError.create("Project not found", 404, httpStatus.FAIL));
  }

  res.json({
    status: httpStatus.SUCCESS,
    data: { project },
  });
});

module.exports = {
  getProjects,
  createProject,
  editProject,
  deleteProject,
};
