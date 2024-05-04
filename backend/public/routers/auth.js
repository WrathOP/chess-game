"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const auth = (0, express_1.Router)();
let CLIENT_URL;
if (process.env.NODE_ENV === "production") {
    console.log("Using .env file for production");
    CLIENT_URL = "https://chess-game-omega-topaz.vercel.app/game/random";
}
else if (process.env.NODE_ENV === "developement") {
    CLIENT_URL = "http://localhost:5173/game/random";
}
else {
    console.log("Using .env file for testing");
    CLIENT_URL = "http://localhost:5173/game/random";
}
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
auth.get("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const user = req.user;
        // Token is issued so it can be shared b/w HTTP and ws server
        // Todo: Make this temporary and add refresh logic here
        const userDb = yield db_1.db.user.findFirst({
            where: {
                id: user.id,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.json({
            token,
            id: user.id,
            name: userDb === null || userDb === void 0 ? void 0 : userDb.name,
        });
    }
    else {
        console.log("Unauthorized User");
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}));
auth.get("/github", passport_1.default.authenticate("github", {
    scope: ["email", "profile"],
}));
auth.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login",
}));
exports.default = auth;
