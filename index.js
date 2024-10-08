require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const PORT = 3000;

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/courses", courseRouter);


async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(PORT, () => {
    console.log("Running at Port -> " + PORT);
  });
}

main();
