//this middleware is used to verify JWT token.
const jwt = require("jsonwebtoken");

//you can give your own {JWT_SECRET}
// /!\ use .env file for this..

const JWT_SECRET = "bshkgfv$%#%$iogvbsds'oumah'kgvdfhv";

const fetchingUser = (req, res, next) => {
  try {
    const authToken = req.header("auth-token");
    if (!authToken) {
      return res.status(401).json({ error: "Sorry You not Login Yet!!." });
    }
    const verify = jwt.verify(authToken, JWT_SECRET);

    req.user = verify.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Problem..." });
  }
};

module.exports = fetchingUser;
