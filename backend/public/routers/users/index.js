"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const users = (0, express_1.Router)();
users.get("/", controller_1.getUsers);
users.patch("/", controller_1.getUsers);
exports.default = users;
