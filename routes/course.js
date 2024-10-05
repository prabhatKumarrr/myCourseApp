const { Router } = require("express");
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middlewares/user");
const courseRouter = Router();


courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;


  //should check whether the user has paid the price or not
  await purchaseModel.create({
    userId,
    courseId
  });

  res.json({
    message: "You have bought the course",
  });
});

courseRouter.get("/preview", async (req, res) => {
  const courses = await courseModel.find({});

  res.json({
    courses
  });
});

module.exports = {
  courseRouter: courseRouter,
};
