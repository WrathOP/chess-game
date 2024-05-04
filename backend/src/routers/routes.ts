import { Router } from "express";
import users from "./users/index";

const routes = Router();

/// Setting up default router
routes.get("/", (req, res) => {
    res.send("Hello World!");
});

/// Setting up routes for users
routes.use("/users", users);

export default routes;