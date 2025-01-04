const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// 체크 로그인
const checkLogin = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.redirect("/admin");
    }else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userId = decoded.userId;
            next();
    } catch (err) {
        return res.redirect("/admin");
    }
}};

router.get("/admin", (req, res) => {
    const locals = {
        title: "Admin"
    };
    res.render("admin/index", { locals, layout: adminLayout2 });
});

router.post("/admin", asyncHandler( async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/allPosts");
}));

router.get("/register", asyncHandler( async (req, res) => { 
    const locals = {
        title: "Register"
    };
    res.render("admin/index", { locals, layout: adminLayout2 });
}));

router.post("/register", asyncHandler( async (req, res) => { 
    const hassedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
        username: req.body.username,
        password: hassedPassword
    });
}));

router.get(
    "/allPosts",
    checkLogin,
    asyncHandler( async (req, res) => {
    const locals = {
        title: "All Posts"
    };
    const data = await Post.find();
    res.render("admin/allPosts", { locals, data, layout: adminLayout });
}
));

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

router.get("/add", checkLogin, (req, res) => {
    const locals = {
        title: "Add Post"
    };
    res.render("admin/add", { locals, layout: adminLayout });
});

router.post("/add", checkLogin, asyncHandler( async (req, res) => {
    const { title, body } = req.body;
    const newPost = new Post({ title, body });

    await Post.create(newPost);
    res.redirect("/allPosts");
}));

router.get("/edit/:id", checkLogin, asyncHandler( async (req, res) => {
    const locals = {
        title: "Edit Post"
    };
    const data = await Post.findById(req.params.id);
    res.render("admin/edit", { locals, data, layout: adminLayout });
}));

router.put("/edit/:id", checkLogin, asyncHandler( async (req, res) => {
    const { title, body } = req.body
    await Post.findByIdAndUpdate(req.params.id, { title,
    body, createdAt: Date.now() });
    res.redirect("/allPosts");
}
));

router.delete("/delete/:id", checkLogin, asyncHandler( async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/allPosts");
}    
));

module.exports = router;