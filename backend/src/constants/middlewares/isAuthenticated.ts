import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const accessToken = req.headers["authorization"];

    if (!accessToken) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Access token is missing" });
    }

    // You can perform additional validation or verification of the access token here

    next();
}
