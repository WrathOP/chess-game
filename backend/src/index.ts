import express from "express";
import routes from "./routers/routes";
import cors from "cors";
import auth from "./routers/auth";
import dotenv from "dotenv";
import { websocketRoute } from "./websockets";
import cookieParser from 'cookie-parser';

const logger = require("morgan");
const app = express();
dotenv.config();

app.use(logger("dev"));

app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
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
