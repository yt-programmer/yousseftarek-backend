const httpStatus = require("../utils/httpStatus");

const Project = require("../models/project.model");

const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getProjects = asyncWrapper(async (req, res) => {
  const q = req.query;
  const page = parseInt(q.page) || 1;
  const limit = parseInt(q.limit) || 10;
  const skip = (page - 1) * limit;

  const projects = await Project.find({}, { __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({
    status: httpStatus.SUCCESS,
    data: { projects },
  });
});

const createProject = asyncWrapper(async (req, res, next) => {
  const { title, description, image, link, skils } = req.body;

  if (!title || !description || !image || !link || !skils) {
    return next(
      appError.create("All fields are required", 400, httpStatus.FAIL),
    );
  }

  const project = await new Project({
    title,
    description,
    image,
    link,
    skils,
  });
  await project.save();

  const projects = await Project.find({}, { __v: 0 });

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { projects },
  });
});
const editProject = asyncWrapper(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
  );

  if (!project) {
    return next(appError.create("Project not found", 404, httpStatus.FAIL));
  }

  await project.save();

  const projects = await Project.find({}, { __v: 0 });

  res.json({
    status: httpStatus.SUCCESS,
    data: { projects },
  });
});

const deleteProject = asyncWrapper(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id });
  if (!project) {
    return next(appError.create("Project not found", 404, httpStatus.FAIL));
  }

  const projects = await Project.find({}, { __v: 0 });

  res.json({
    status: httpStatus.SUCCESS,
    data: { projects },
  });
});

module.exports = {
  getProjects,
  createProject,
  editProject,
  deleteProject,
};
