const { Router } = require("express");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middlewares/user");
const { inputSignUp, inputSignIn } = require("../middlewares/inputValidation");

userRouter.post("/signup", inputSignUp, async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  //same Todos as admin signup/signin endpoints

  await userModel.create({
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName
  });

  res.json({
    message: "Signed Up",
  });
});

userRouter.post("/signin", inputSignIn, async function(req, res) {
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

userRouter.get("/purchases", userMiddleware, async (req, res) => {
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
