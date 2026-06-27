require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const URL = process.env.MONGO_URL;
const httpStatus = require("./utils/httpStatus");
const projectsRouter = require("./routes/projects.route");
const adminRouter = require("./routes/admin.route");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP",
  }),
);
app.use(helmet());
app.use("/api/projects", projectsRouter);
app.use("/api/sendmail", require("./routes/sendMail.route"));
app.use("/api/testimonials", require("./routes/testimonials.route"));
app.use("/api/auth", adminRouter);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || httpStatus.ERROR,
    message: err.message || "Something went wrong",
    code: err.statusCode || 500,
  });
});

mongoose
  .connect(URL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("Error DB =>", err));

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
