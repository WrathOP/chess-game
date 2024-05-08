import express from "express";
import routes from "./routers/routes";
import cors from "cors";
import auth from "./routers/auth";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { websocketRoute } from "./websockets";
import { isAuthenticated } from "./constants/middlewares/isAuthenticated";

const logger = require("morgan");
const app = express();
dotenv.config();

app.use(logger("dev"));

app.use(
    session({
        secret: "keyboard warriors in shambles",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 360000 },
    })
);

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://chess-game-omega-topaz.vercel.app",
        ],
        methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
        credentials: true,
    })
);

app.use("/auth", auth);

app.use("/v1", routes);
app.use("/", websocketRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
