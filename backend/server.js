const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const authController = require('./controllers/authControllers')
const ProductController = require('./controllers/ProductController')
const uploadController = require('./controllers/uploadController')
const app = express()
//connection to the database
const mongoURI = process.env.MONGO_URL;

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToMongo();
// routes and middlewares
app.use(express.json())
app.use(cors())
app.use('/auth', authController)
app.use(express.urlencoded({extended: true}))
app.use('/product', ProductController)
app.use('/upload', uploadController)

//start of the server

app.listen(process.env.PORT, () => console.log("Server has been started"))