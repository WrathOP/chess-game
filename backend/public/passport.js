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
exports.initPassport = void 0;
const GithubStrategy = require("passport-github2").Strategy;
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "your_github_client_id";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "your_github_client_secret";
function initPassport() {
    if (!GITHUB_CLIENT_ID ||
        !GITHUB_CLIENT_SECRET) {
        throw new Error("Missing environment variables for authentication providers");
    }
    passport_1.default.use(new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
    }, function (accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            // upsert is a prisma method that will create a new user if it doesn't exist
            // and update the user if it does exist
            const user = yield db_1.db.user.upsert({
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
        });
    }));
    passport_1.default.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, {
                id: user.id,
                username: user.username,
                picture: user.picture,
            });
        });
    });
    passport_1.default.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
}
exports.initPassport = initPassport;
