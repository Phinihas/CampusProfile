const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubGreddiit = require("./subgreddiitSchema");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    match: /^[a-zA-Z ]+$/,
  },

  lastName: {
    type: String,
    required: true,
    match: /^[a-zA-Z ]+$/,
  },

  userName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._-]{3,15}$/,
  },

  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  }, 
  skills:{
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
    match: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
  },

  contactNumber: {
    type: Number,
    required: true,
    match: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  },

  password: {
    type: String,
    required: true,
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  followers: [
    {
      follower: {
        type: String,
      },
    },
  ],

  followings: [
    {
      following: {
        type: String,
      },
    },
  ],

  subgreddiits: [
    {
      subgreddiit: {
        type: String,
      },
    },
  ],

  requestedJoins: [
    {
      request: {
        type: String,
      },
    },
  ],

  acceptedJoins: [
    {
      accept: {
        type: String,
      },
    },
  ],

  leftSG: [
    {
      left: {
        type: String,
      },
    },
  ],
  savedPosts: [
    {
      saved: {
        subgreddiitId: { type: String },
        postId: { type: String },
      },
    },
  ],
  blockedSubgreddiits: [
    {
      blocked: {
        type: String,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    console.log(e);
  }
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
 