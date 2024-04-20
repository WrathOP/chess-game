const GithubStrategy = require("passport-github2").Strategy;
import passport from "passport";
import dotenv from "dotenv";
import { db } from "./db";

dotenv.config();

const GITHUB_CLIENT_ID =
    process.env.GITHUB_CLIENT_ID || "your_github_client_id";
const GITHUB_CLIENT_SECRET =
    process.env.GITHUB_CLIENT_SECRET || "your_github_client_secret";

export function initPassport() {
    if (
       
        !GITHUB_CLIENT_ID ||
        !GITHUB_CLIENT_SECRET 
       
    ) {
        throw new Error(
            "Missing environment variables for authentication providers"
        );
    }

    passport.use(
        new GithubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: "/auth/github/callback",
            },
            async function (
                accessToken: string,
                refreshToken: string,
                profile: any,
                done: (error: any, user?: any) => void
            ) {
                // upsert is a prisma method that will create a new user if it doesn't exist
                // and update the user if it does exist
                const user = await db.user.upsert({
                    create: {
                        email: profile.profileUrl || profile.emails[0].value,
                        name: profile.displayName || profile.username,
                        provider: "GITHUB",
                    },
                    update: {
                        name: profile.displayName,
                    },
                    where: {
                        email: profile.profileUrl,
                    },
                });

                done(null, user);
            }
        )
    );

    passport.serializeUser(function (user: any, cb) {
        process.nextTick(function () {
            return cb(null, {
                id: user.id,
                username: user.username,
                picture: user.picture,
            });
        });
    });

    passport.deserializeUser(function (user: any, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
}
