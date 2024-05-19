import { User } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import querystring from "querystring";
import axios from "axios";
import CustomError from "../constants/error";

const auth = Router();

let CLIENT_URL_REDIRECT;
let CLIENT_LOGOUT_REDIRECT;

if (process.env.NODE_ENV === "production") {
    console.log("Using .env file for production");
    CLIENT_URL_REDIRECT =
        "https://chess-game-omega-topaz.vercel.app/game/random";
    CLIENT_LOGOUT_REDIRECT = "https://chess-game-omega-topaz.vercel.app";
} else if (process.env.NODE_ENV === "developement") {
    CLIENT_URL_REDIRECT = "http://localhost:5173/game/random";
    CLIENT_LOGOUT_REDIRECT = "http://localhost:5173";
} else {
    console.log("Using .env file for testing");
    CLIENT_URL_REDIRECT = "http://localhost:5173/game/random";
    CLIENT_LOGOUT_REDIRECT = "http://localhost:5173";
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

// TODO: Get the tokens from the req.

auth.get("/refresh", async (req: Request, res: Response) => {
    const { accessToken, idToken } = req.cookies;

    // console.log("Access Token: ", accessToken);
    // console.log("ID Token: ", idToken);
    if (!idToken || !accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        // const response = await axios.post(
        //     `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`,
        //     { access_token: accessToken },
        //     {
        //         headers: {
        //             Accept: "application/vnd.github+json",
        //             Authorization: `Bearer ${accessToken}`,
        //             "X-GitHub-Api-Version": "2022-11-28",
        //         },
        //         validateStatus: (status) => status >= 200 && status <= 500,
        //     }
        // );
        // console.log("Response: ", response);

        // if (response.status === 404) {
        //     return res.status(StatusCodes.UNAUTHORIZED).json({
        //         success: false,
        //         message: "Unauthorized",
        //     });
        // }

        const decoded = jwt.verify(idToken, JWT_SECRET) as { userId: string };

        const user = await db.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized",
        });
    }
});

auth.get("/logout", (req: Request, res: Response) => {
    res.clearCookie("idToken");
    res.clearCookie("accessToken");
    res.redirect(CLIENT_LOGOUT_REDIRECT);
});

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

        if (!profile.id) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
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
        });

        console.log("Access Token: ", accessToken);
        res.redirect(CLIENT_URL_REDIRECT);
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
