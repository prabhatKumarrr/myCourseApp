const { Router } = require("express");
const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
  res.json({
    msg: "Signed up",
  });
});

adminRouter.post("/signin", (req, res) => {
  res.json({
    msg: "Signed in",
  });
});

adminRouter.post("/createCourse", (req, res) => {
  res.json({
    msg: "Course Created",
  });
});

adminRouter.delete("/deleteCourse", (req, res) => {
  res.json({
    msg: "Course Deleted",
  });
});

adminRouter.put("/changeContent", (req, res) => {
  res.json({
    msg: "Course Updated",
  });
});

module.exports = {
  adminRouter: adminRouter,
}
