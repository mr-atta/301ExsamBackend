"use strict";

const mongoose = require("mongoose");

let colorData = new mongoose.Schema({
  title: String,
  imageUrl: String,
});

let userData = new mongoose.Schema({
  email: String,
  colors: [colorData],
});

let myUserData = mongoose.model("user", userData);

module.exports = myUserData;
