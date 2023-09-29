// datbase matching authentication 

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Mongoose atlas is connected...");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    });
    if (user && user.password === password) {
      res.status(201).json({
        message: "Valid User...",
      });
    } else {
      res.status(201).json({
        message: "Invalid User...",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//route not found error
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found...",
  });
});
//handaling server error
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something broke...",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
