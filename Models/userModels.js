const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  posts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      post: { type: String },
      created: { type: Date, default: Date.now() }
    }
  ],
  following: [
    { userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }
  ],
  followers: [
    { follower: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }
  ],
  notifications: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String },
      viewProfile: { type: Boolean, default: false },
      created: { type: Date, default: Date.now() },
      read: { type: Boolean, default: false },
      date: { type: String, default: ''}
    }
  ],
  chatList: [
    {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    msgId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
