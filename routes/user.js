const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  res.json({
    message: "Signup Endpoint",
  });
});

userRouter.post("/signin", function(req, res) {
  res.json({
    message: "Signin Endpoint",
  });
});

userRouter.get("/purchaseCourse", (req, res) => {
  res.json({
    message: "Course Purchased",
  });
});

userRouter.get("/allCourses", (req, res) => {
  res.json({
    msg: "All Courses",
  });
});

module.exports = {
  userRouter: userRouter,
}
