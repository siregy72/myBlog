const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/admin", (req, res) => {
    const locals = {
        title: "Admin"
    };
    res.render("admin/index", { locals, layout: adminLayout2 });
});

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

module.exports = router;