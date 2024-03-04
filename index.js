//By this API you can access [Login, Sign-up,Sign-In]+[CRUD-operation]

const express = require("express");
const path = require("path");
const ConnectToMongo = require("./database");
const app = express();
const port = 9852;

ConnectToMongo()
//express.json()-> use to access req.body portion in both router.
app.use(express.json())
app.use(require(path.join(__dirname, "Routes/auth.js")));
app.use(require(path.join(__dirname, "Routes/crud.js")));

app.listen(port, () => {
  console.log(`Browser is running on http://localhost:${port}`);
});
