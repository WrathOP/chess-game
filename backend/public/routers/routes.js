"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes = (0, express_1.Router)();
/// Setting up default router
routes.get("/", (req, res) => {
    res.send("Hello World!");
});
/// Setting up routes for users
// routes.use("/users", require("./users"));
exports.default = routes;
