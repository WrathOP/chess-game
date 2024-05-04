import { Request, Response } from "express";
import { db } from "../../db";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const user = await db.user.findFirst();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    try {
        const user = await db.user.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};
