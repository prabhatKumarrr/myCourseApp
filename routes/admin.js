const { Router } = require("express");
const { adminModel, courseModel } = require(../db);
const jwt = require("jsonwebtoken");
const{ JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");
const adminRouter = Router();

//bcrypt, zod to be added later

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  //Add Zod validation
  //hash the password

  await adminModel.create({
    email,
    password,
    firstName,
    lastName
  });

  res.json({
    msg: "Signed up",
  });
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({
    email: email,
    password: password //compare hashed passwords here
  });

  if(admin) {
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
      message: "Invalid Credentials",
    });
  }
});

adminRouter.post("/createCourse", adminMiddleware, async (req, res) => {
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


//Update Later....
adminRouter.delete("/deleteCourse", (req, res) => {
  res.json({
    msg: "Course Deleted",
  });
});

adminRouter.put("/changeContent", adminMiddleware, async (req, res) => {
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
  adminRouter: adminRouter,
}
