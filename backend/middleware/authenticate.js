const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const SubGreddiit = require("../model/subgreddiitSchema");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new Error("No token provided");

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (e) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    console.log("Login to continue");
  }
};

module.exports = Authenticate;
