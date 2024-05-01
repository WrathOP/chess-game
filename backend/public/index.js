"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routers/routes"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = require("./passport");
const auth_1 = __importDefault(require("./routers/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const passport_2 = __importDefault(require("passport"));
const websockets_1 = require("./websockets");
const logger = require('morgan');
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(logger('dev'));
app.use((0, express_session_1.default)({
    secret: "keyboard warriors in shambles",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 360000 },
}));
(0, passport_1.initPassport)();
app.use(passport_2.default.initialize());
app.use(passport_2.default.authenticate("session"));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://chess-game-qk6ppa1ml-wrathops-projects.vercel.app",
        "https://chess-game-omega-topaz.vercel.app",
    ],
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    credentials: true,
}));
app.use("/auth", auth_1.default);
app.use("/v1", routes_1.default);
app.use("/", websockets_1.websocketRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
