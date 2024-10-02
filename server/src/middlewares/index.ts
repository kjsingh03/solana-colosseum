import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/index.js";
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET ?? '';

export function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] ?? "";

    try {
        const decoded = jwt.verify(authHeader, jwtSecret);

        if (typeof decoded === 'object' && 'email' in decoded) {
            req.email = decoded.email;
            next();
        }
        else {
            res.status(403).json({ msg: "User not logged in" })
        }
    } catch (e) {
        res.status(403).json({ msg: "User not logged in" })
    }
}