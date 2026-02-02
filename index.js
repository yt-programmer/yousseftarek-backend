const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
const port = process.env.PORT || 5000;
const URL = process.env.MONGO_URL;
const httpStatus = require("./utils/httpStatus");
const projectsRouter = require("./routes/projects.route");
const adminRouter = require("./routes/admin.route");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

mongoose
  .connect(URL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("Error DB =>", err));

app.use("/api/projects", projectsRouter);
app.use("/api/sendmail", require("./routes/sendMail.route"));
app.use("/api/auth", adminRouter);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || httpStatus.ERROR,
    message: err.message || "Something went wrong",
    code: err.statusCode || 500,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
