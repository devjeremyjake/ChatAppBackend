// REQUIRING DEPENDENCIES.
const Joi = require("joi");
const HttpStatus = require("http-status-codes");

// REQUIRING EXTERNAL FILES.
const Post = require("../models/postModels");
const User = require("../models/userModels");

module.exports = {
  // ADD POST CONTROLLER
  AddPost(req, res) {
    const schema = Joi.object().keys({
      post: Joi.string()
        .min(3)
        .required()
    });
    const { error } = Joi.validate(req.body, schema);

    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    const body = {
      user: req.user._id,
      Username: req.user.username,
      post: req.body.post,
      Created: new Date()
    };

    Post.create(body)
      .then(async post => {
        await User.update(
          {
            _id: req.user._id
          },
          {
            $push: {
              posts: {
                postId: post._id,
                post: req.body.post,
                created: new Date()
              }
            }
          }
        );
        res.status(HttpStatus.OK).json({ message: "Post Created", post });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error Occured" });
      });
  },

  // GET ALL POST CONTROLLER.
  async GetAllPosts(req, res) {
    try {
      const posts = await Post.find({})
        .populate("user")
        .sort({ created: -1 });
      return res
        .status(HttpStatus.OK)
        .json({ mesage: "All Post Retrived", posts });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ mesage: "Error Occured" });
    }
  },

  // ADD LIKE TO POST CONTROLLER.
  async AddLike(req, res) {
    const postId = req.body._id;
    await Post.update(
      {
        _id: postId,
        "likes.username": { $ne: req.user.username }
      },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: { totalLikes: 1 }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "You Liked the post" });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error Occured" });
      });
  },

  // ADD COMMENT TO POST CONTROLLER.
  async AddComment(req, res) {
    const postId = req.body.postId;
    await Post.update(
      {
        _id: postId
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: new Date()
          }
        }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "Comment Added to post" });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error Occured" });
      });
  },

  // GET COMMENTS FOR SINGLE POST CONTROLLER.
  async GetPost(req, res) {
    await Post.findOne({ _id: req.params.id })
      .populate("user")
      .populate("comments.userId")
      .then(post => {
        res.status(HttpStatus.OK).json({ message: "Post found", post });
      })
      .catch(err =>
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Post not found", post })
      );
  }
};
