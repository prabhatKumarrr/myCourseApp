const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  //same Todos as admin signup/signin endpoints

  await userModel.create({
    email,
    password,
    firstName,
    lastName
  });

  res.json({
    message: "Signed Up",
  });
});

userRouter.post("/signin", async function(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email: email,
    password: password
  });

  if(user) {
    const token = jwt.sign({
      id: user._id,
    }, JWT_USER_PASSWORD);

    res.json({
      msg: "Signed In",
      token: token
    });
  }
  else {
    res.status(403).json({
      message: "Incorrect credentials"
    });
  }
});

userRouter.get("/purchases", async (req, res) => {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }

  const courseData = await courseModel.find({
    _id: { $in: purchasedCourseIds}
  });

  res.json({
    purchases,
    courseData
  });
});


module.exports = {
  userRouter: userRouter,
}
