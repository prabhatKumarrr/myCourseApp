const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const{ JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");
const adminRouter = Router();
const { inputSignUp, inputSignIn, inputCourse } = require("../middlewares/inputValidation");
const bcrypt = require("bcrypt");



adminRouter.post("/signup", inputSignUp, async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  const hashPass = await bcrypt.hash(password, 10);

  await adminModel.create({
    email,
    password: hashPass,
    firstName,
    lastName
  });

  res.json({
    msg: "Signed up",
  });
});

adminRouter.post("/signin", inputSignIn, async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({
    email: email,
  });

  if(admin) {
    const hashPass = await bcrypt.compare(password, admin.password);

    if(hashPass) {
      const token = jwt.sign({
        id: admin._id,
      }, JWT_ADMIN_PASSWORD);
     
      //try cookie logic

      res.json({
        msg: "Signed In",
        token: token,
      });
    }
    else {
      res.status(403).json({
        message: "Incorrect Password"
      });
    }
  }
  else {
    res.status(404).json({
      message: "Invalid Credentials",
    });
  }
});

adminRouter.post("/createCourse", adminMiddleware, inputCourse, async (req, res) => {
  const adminId = req.adminId;

  const { title, description, imageUrl, price } = req.body;

  //creating a web3 saas in 6 hrs(harkirat)
  
  const course = await courseModel.create({
    title,
    description,
    imageUrl,
    price,
    creatorId: adminId,
  });

  res.json({
    msg: "Course Created",
    courseId: course._id,
  });
});


adminRouter.delete("/deleteCourse", adminMiddleware, async (req, res) =>  {
  const adminId = req.adminId;
  const courseId = req.body.courseId;

  const course = await courseModel.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  if(!course) {
    res.status(403).json({
      message: "Course not Found! or Unauthorised Creator/admin",
    });
  }
  else {
    await courseModel.deleteOne({
      _id: courseId,
    });
    
    res.json({
      message: "Course removed Successfully",
    });

  }
});

adminRouter.put("/changeContent", adminMiddleware, inputCourse, async (req, res) => {
  const adminId = req.adminId;

  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.updateOne({
    _id: courseId,
    creatorId: adminId,
  }, {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
  });

  res.json({
    msg: "Course Updated",
    courseId: course._id,
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    message: "All course by this creator",
    courses: courses,
  });
});

module.exports = {
  adminRouter,
}
