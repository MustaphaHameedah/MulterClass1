const mongoose = require("mongoose");

require("dotenv").config();

const DB = process.env.MONDODB_URI;
mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log(`Error connecting to database: ${error.message}`);
  });
