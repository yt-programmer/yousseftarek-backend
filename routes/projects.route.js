const express = require("express");
const router = express.Router();

const {
  getProjects,
  createProject,
  editProject,
  deleteProject,
} = require("../controllers/projects.controller");

const verifyToken = require("../middlewares/verifyToken");

router.route("/").get(getProjects).post(verifyToken, createProject);

router
  .route("/:id")
  .patch(verifyToken, editProject)
  .delete(verifyToken, deleteProject);

module.exports = router;
