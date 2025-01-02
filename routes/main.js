const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main";
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

router.get([ "/", "/home" ], asyncHandler( async (req, res) => {
    const locals = {
        title: "Home"
    };
    const data = await Post.find();
    res.render("index", { locals, data, layout: mainLayout });
}));
router.get("/about", (req, res) => {
    const locals = {
        title: "About"
    };
    res.render("about", { locals, layout: mainLayout });
});

// 게시물 상세보기
router.get("/post/:id", asyncHandler( async (req, res) => {
    const locals = {
        title: "Post"
    };
    const data = await Post.findById(req.params.id);
    res.render("post", { locals, data, layout: mainLayout });
}));

module.exports = router;
