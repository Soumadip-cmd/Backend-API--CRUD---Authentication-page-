//this is use for authentication
// e.g: {Login ,Sign-up,Sign-In} page

const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const path = require("path");
var jwt = require("jsonwebtoken");
const User = require("../connection/user");
const fetchingUser = require("../middleware/fetchingUser");

const router = express.Router();
const JWT_SECRET = "bshkgfv$%#%$iogvbsds'oumah'kgvdfhv";

router.post(
  "/create",
  [
    body("email", "Enter a valid Email").isEmail(),
    // password must be at least 5 chars long
    body("password", "password must be at least 5 chars long").isLength({
      min: 5,
    }),
    body("name", "Give a usefull name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const salting = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salting);
      User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })
        .then((user) => res.json(user))
        .catch((err) => {
          console.error(err.message);
        });

      const data = {
        user: User.id,
      };
      const token = jwt.sign(data, JWT_SECRET);
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Problem..." });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "password must be at least 5 chars long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Login Failed.." });
      }
      const verifyPass = await bcrypt.compare(password, user.password);
      if (!verifyPass) {
        return res.status(401).json({ error: "Login Failed.." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Problem..." });
    }
  }
);

router.post("/getuser", fetchingUser, async(req, res) => {
    const userId=req.user.id
    const details=await User.findById(userId).select("-password")
    res.send(details)
});
module.exports = router;
