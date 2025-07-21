const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const mongoose = require("mongoose");

const app = express();



mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


// Import the Fruit Model
const Fruit =require("./models/fruit.js");

// Adding the middleware for the app ABOVE ALL DEFINED ROUTES
app.use(express.urlencoded({ extended: false }));


// GET
app.get("/", async (req, res) => {
    res.render("index.ejs");
})

// GET /fruits
app.get("/fruits", async (req, res) => {
    const allTheFruits = await Fruit.find();
    res.render("fruits/index.ejs", { fruits: allTheFruits });
});

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs")
});

// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits");
});




app.listen(3000, () => {
  console.log('Listening on port 3000');
});
