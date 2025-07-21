const dotenv = require("dotenv");
dotenv.config();

const express = require('express');

// server.js
const app = express();
const mongoose = require("mongoose");
const methodOverride=require("method-override");
const morgan = require("morgan");


// Database Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


// Import the Fruit Model
const Fruit =require("./models/fruit.js");

// Adding the middleware for the app ABOVE ALL DEFINED ROUTES
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev"));

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


//GET /fruits/:fruitId
app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log(foundFruit);
    res.render("fruits/show.ejs", { fruit: foundFruit});
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


// DELETE /fruits/:fruitsId
app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});




app.listen(3000, () => {
  console.log('Listening on port 3000');
});
