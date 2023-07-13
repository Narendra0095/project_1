const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// HomePage
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

// ZoomPost
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

// profile
router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

// Create Post
router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.UserId = req.user.id;
  post.username = req.user.username;
  await Posts.create(post);
  res.json(post);
});

// Edit Post-Title
router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

// Edit Post-Text
router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

// Delete post
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;

  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
