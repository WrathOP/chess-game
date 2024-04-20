import { Router } from "express";

const routes = Router();

/// Setting up default router
routes.get("/", (req, res) => {
    res.send("Hello World!");
});

/// Setting up routes for users
// routes.use("/users", require("./users"));

export default routes;