const zod = require("zod");

const credentialsSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
  firstName: zod.string().max(15),
  lastName: zod.string().max(15)
});

const credentialsSchemaLogin = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

const courseValidSchema = zod.object({
  title: zod.string().max(30),
  description: zod.string().max(120),
  price: zod.number(),
  imageUrl: zod.string().url(),
});

function inputSignUp(req, res, next) {
  const input = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }

  const validation = credentialsSchema.safeParse(input);

  if(validation.success == true) {
    next();
  }
  else {
    res.status(403).json({
      messsage: "Invalid Input!!",
    });
  }
}

function inputSignIn(req, res, next) {
  const input = {
    email: req.body.email,
    password: req.body.password,
  }

  const validation = credentialsSchemaLogin.safeParse(input);

  if(validation.success == true) {
    next();
  }
  else {
    res.status(403).json({
      messsage: "Invalid Input!!",
    });
  }
}

function inputCourse(req, res, next) {
  const input = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
  };

  const validation = courseValidSchema.safeParse(input);

  if(validation.success == true) {
    next();
  }
  else {
    res.status(403).json({
      message: "Invalid Input",
    });
  }
}


module.exports = {
  inputSignUp,
  inputSignIn,
  inputCourse
}
