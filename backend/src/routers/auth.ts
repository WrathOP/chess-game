import { User } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import querystring from "querystring";
import axios from "axios";
import CustomError, { formatError } from "../constants/error";
import { format } from "path";

const auth = Router();

let CLIENT_URL;

if (process.env.NODE_ENV === "production") {
    console.log("Using .env file for production");
    CLIENT_URL = "https://chess-game-omega-topaz.vercel.app/game/random";
} else if (process.env.NODE_ENV === "developement") {
    CLIENT_URL = "http://localhost:5173/game/random";
} else {
    console.log("Using .env file for testing");
    CLIENT_URL = "http://localhost:5173/game/random";
}

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function getGitHubUserProfile(accessToken: string) {
    try {
        const profile = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        return profile.data;
    } catch (error) {
        throw new CustomError(
            "GITHUB_PROFILE_ERROR",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal Server Error"
        );
    }
}

auth.get("/github", (req: Request, res: Response) => {
    const queryParams = querystring.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.LOCAL_URL + "/auth/github/callback",
        scope: "read:user user:email user:follow",
    });
    res.redirect(`https://github.com/login/oauth/authorize?${queryParams}`);
});

auth.get("/github/callback", async (req: Request, res: Response) => {
    const { code } = req.query as { code: string };

    try {
        const { data } = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const accessToken = data.access_token;
        const profile = await getGitHubUserProfile(accessToken);

        if (!profile.data.id) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const user = await db.user.upsert({
            create: {
                email: profile.email ?? profile.html_url,
                name: profile.name ?? profile.login,
                provider: "GITHUB",
            },
            update: {
                name: profile.name ?? profile.login,
            },
            where: {
                email: profile.email ?? profile.html_url,
            },
        });

        const idToken = jwt.sign({ userId: user.id }, JWT_SECRET);

        res.cookie("idToken", idToken, {
            httpOnly: true,
            secure: true,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            expires: data.expires_in,
        });

        console.log("Access Token: ", accessToken);
        res.redirect(CLIENT_URL);
    } catch (err) {
        console.log(err);
        if (err instanceof CustomError) {
            res.status(err.httpCode).json({
                success: false,
                message: err.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
});

export default auth;
