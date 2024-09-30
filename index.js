const express = require("express");
const mongoose = require("mongoose");
const PORT = 3000;

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();

app.use("/user", userRouter);
app.use("/courses", courseRouter);
app.use("/admin", adminRouter);


async function main() {
  await mongoose.connect("");
  app.listen(PORT, () => {
    console.log("Running at Port -> " + PORT);
  });
}
