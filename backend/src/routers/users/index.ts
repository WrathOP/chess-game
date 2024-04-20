import { Router } from "express";
import { getUsers } from "./controller";

const users = Router();

users.get("/", getUsers);
