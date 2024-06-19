const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const User = require("./userSchema");

const subGreddiitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  followers: [
    {
      follower: {
        type: String,
      },
    },
  ],
  followersCount: {
    type: Number,
    default: 1,
  },
  posts: [
    {
      postName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      postedBy: {
        Id: {
          type: String,
          required: true,
        },
        userName: {
          type: String,
          required: true,
          match: /^[a-zA-Z0-9._-]{3,15}$/,
        },
      },
      postedIn: {
        type: String,
        required: true,
      },
      likes: [
        {
          like: {
            type: String,
          },
        },
      ],
      dislikes: [
        {
          dislike: {
            type: String,
          },
        },
      ],
      comments: [
        {
          comment: {
            type: String,
          },
          commentedBy: {
            type: String,
            match: /^[a-zA-Z0-9._-]{3,15}$/,
          },
          commentedByID: {
            type: String,
          },
        },
      ],
    },
  ],
  joinrequests: [
    {
      user: {
        userID: {
          type: String,
        },
        userName: {
          type: String,
          match: /^[a-zA-Z0-9._-]{3,15}$/,
        },
      },
    },
  ],
  tags: [
    {
      tag: {
        type: String,
        match: /^\s*[a-z]+(?:\s*,\s*[a-z]+)*\s*$/,
      },
    },
  ],

  bannedKeyWords: [
    {
      keyword: {
        type: String,
        match: /^\s*[a-zA-Z]+(?:\s*,\s*[a-zA-Z]+)*\s*$/,
      },
    },
  ],
  reported: [
    {
      reportedBy: {
        type: String,
      },
      reportedByName: {
        type: String,
        match: /^[a-zA-Z0-9._-]{3,15}$/,
      },
      reportedTo: {
        type: String,
      },
      reportedToName: {
        type: String,
        match: /^[a-zA-Z0-9._-]{3,15}$/,
      },
      text: {
        type: String,
      },
      post: {
        type: String,
      },
      postName: {
        type: String,
      },
      ignored: {
        type: Number,
      },
      creationDate: {
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
  blockedSG: [
    {
      blocked: {
        type: String,
      },
    },
  ],

  acceptedDates: [
    {
      acceptedDate: {
        type: String,
      },
    },
  ],

  openDates: [
    {
      openDate: {
        type: String,
      },
    },
  ],

  postDates: [
    {
      postDate: {
        type: String,
      },
    },
  ],

  deletePostDates: [
    {
      deletePostDate: {
        type: String,
      },
    },
  ],

  deleteSPostDates: [
    {
      deleteSPostDate: {
        type: String,
      },
    },
  ],

  reportedDates: [
    {
      reportedDate: {
        type: String,
      },
    },
  ],

  rejectedDates: [
    {
      rejectedDate: {
        type: String,
      },
    },
  ],
});

const SubGreddiit = mongoose.model("SubGreddiit", subGreddiitSchema);

module.exports = SubGreddiit;
