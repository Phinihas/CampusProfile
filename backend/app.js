const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const authenticate = require("./middleware/authenticate");
const path = require("path");
dotenv.config({ path: "./config.env" });
const cookieParser = require("cookie-parser");

app.use(express.json());

const DB = process.env.DATABASE;
const PORT = process.env.PORT;

require("./db/conn");
const User = require("./model/userSchema");
const subGreddiitSchema = require("./model/subgreddiitSchema");
// CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // or the specific URL of your frontend application
  credentials: true, // to allow cookies to be sent with requests
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
};

// Use cors middleware with options
app.use(cors(corsOptions));
// app.use(express.static(path.join(__dirname, "/build")));

app.use(cookieParser());

app.get("/api/users", authenticate, (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send(err);
    return res.send(users);
  });
});

app.get("/api/fsubgreddiits", authenticate, (req, res) => {
  subGreddiitSchema.find({}, (err, subgreddiits) => {
    if (err) return res.status(500).send(err);
    return res.send(subgreddiits);
  });
});

app.use(require("./router/auth"));
// app.get('/about', (req, res) => {
//     res.send("Welcome to about page");
// })

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/build/"));
// });

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
