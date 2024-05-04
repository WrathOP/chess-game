"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("./users/index"));
const routes = (0, express_1.Router)();
/// Setting up default router
routes.get("/", (req, res) => {
    res.send("Hello World!");
});
/// Setting up routes for users
routes.use("/users", index_1.default);
exports.default = routes;
