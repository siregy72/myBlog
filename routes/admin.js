const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";

router.get("/admin", (req, res) => {
    const locals = {
        title: "Admin"
    };
    res.render("admin/index", { locals, layout: adminLayout2 });
});

module.exports = router;