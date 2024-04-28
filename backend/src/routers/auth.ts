import { User } from "@prisma/client";
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { db } from "../db";

const auth = Router();

const CLIENT_URL = "http://localhost:5173/game/random";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

auth.get("/refresh", async (req, res) => {
    if (req.user) {
        const user = req.user as User;

        // Token is issued so it can be shared b/w HTTP and ws server
        // Todo: Make this temporary and add refresh logic here

        const userDb = await db.user.findFirst({
            where: {
                id: user.id,
            },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({
            token,
            id: user.id,
            name: userDb?.name,
        });
    } else {
        console.log("Unauthorized User")
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
});
auth.get(
    "/github",
    passport.authenticate("github", {
        scope: ["email", "profile"],
    })
);

auth.get(
    "/github/callback",
    passport.authenticate("github", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login",
    })
);

export default auth;
