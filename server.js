"use strict";
// import
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

//
const app = express();
app.use(cors());
app.use(express.json());
//
const PORT = process.env.PORT;
//
const mongoose = require("mongoose");
// "mongodb://localhost:27017/color"
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//
const myUserData = require("./modul/Schema");
//

//seed
function seedData() {
  let user1 = new myUserData({
    email: "mohammadatta97@gmail.com",
    colors: [
      {
        title: "Black",
        imageUrl: "http://www.colourlovers.com/img/000000/100/100/Black.png",
      },
      {
        title: "dutch teal",
        imageUrl:
          "http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png",
      },
    ],
  });
  let user2 = new myUserData({
    email: "quraanrazan282@gmail.com",
    colors: [
      {
        title: "Black",
        imageUrl: "http://www.colourlovers.com/img/000000/100/100/Black.png",
      },
      {
        title: "dutch teal",
        imageUrl:
          "http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png",
      },
    ],
  });
  user1.save();
  user2.save();
}
//call
// seedData();

//http://localhost:3005/
app.get("/", testHandler);
//http://localhost:3005/getData?email=${}
app.get("/getData", getDataHandler);
//http://localhost:3005/deleteone/${}
app.delete("/deleteone/:id", deleteoneHandler);
//http://localhost:3005/updateone/${}
app.put("/updateone/:id", updateoneHandler);
//api
//http://localhost:3005/getDataAPI
app.get("/getDataAPI", getDataAPIHandler);
//http://localhost:3005/addtofav
app.post("/addtofav", addtofavHandler);
//
class Color {
  constructor(ele) {
    this.title = ele.title;
    this.imageUrl = ele.imageUrl;
  }
}
//
async function getDataAPIHandler(req, res) {
  let apiData = await axios.get(
    "https://ltuc-asac-api.herokuapp.com/allColorData"
  );

  let allData = apiData.data.map((ele, i) => {
    return new Color(ele);
  });
  console.log(allData);
  allData.save();
  res.send(allData.colors);
}
function addtofavHandler(req, res) {
  const { email, title, imageUrl } = req.body;

  myUserData.findOne({ email: email }, (error, addData) => {
    if (error) {
      res.send("error");
    } else {
      addData.colors.push({
        title: title,
        imageUrl: imageUrl,
      });
      addData.save();
      res.send(addData.colors);
    }
  });
}
//
function updateoneHandler(req, res) {
  const index = req.params.id;
  const { email, title, imageUrl } = req.body;

  myUserData.findOne({ email: email }, (error, afterDelData) => {
    if (error) {
      res.send("error");
    } else {
      const updatedDta = {
        title: title,
        imageUrl: imageUrl,
      };
      afterDelData.colors.splice(index, 1, updatedDta);
      afterDelData.save();
      res.send(afterDelData.colors);
    }
  });
}

function deleteoneHandler(req, res) {
  const index = req.params.id;
  const email = req.query.email;

  myUserData.findOne({ email: email }, (error, afterDelData) => {
    if (error) {
      res.send("error");
    } else {
      afterDelData.colors.splice(index, 1);
      afterDelData.save();
      res.send(afterDelData.colors);
    }
  });
}
function getDataHandler(req, res) {
  const email = req.query.email;
  //   console.log(email);
  myUserData.find({ email: email }, (error, dataFavB) => {
    if (error) {
      res.send("error");
    } else {
      res.send(dataFavB[0].colors);
    }
    // console.log(dataFavB);
  });
}

function testHandler(req, res) {
  res.send("its working");
}

//
app.listen(PORT, () => console.log(`listen on ${PORT}`));
