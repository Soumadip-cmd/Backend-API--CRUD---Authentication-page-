//give your database at mongoUrl
const mongoose = require("mongoose");
const mongoUrl = "give a data base url to create your api";

const ConnectToMongo = () => {
  mongoose.connect(mongoUrl);
  console.log("Database Connected.");
};

module.exports = ConnectToMongo;
