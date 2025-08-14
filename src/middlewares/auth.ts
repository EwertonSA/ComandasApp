import { NextFunction, Request, Response } from "express"
import { jwtService } from "../services/jwtService.js"
import { userService } from "../services/userService.js"
import { JwtPayload } from "jsonwebtoken"
import { UserInstance } from "../models/User.js"

import cookieParser from "cookie-parser";
export interface AuthenticatedRequest extends Request{
    user?:UserInstance|null
}

// lembre de usar app.use(cookieParser()) no Express

export default function ensureAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // 1. tenta pelo header
    let token = null;
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
        token = header.replace("Bearer ", "");
    }

    // 2. se não tiver header, tenta pelo cookie
    if (!token && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Não autorizado" });
    }

    jwtService.verifyToken(token, (err, decoded) => {
        if (err || typeof decoded === "undefined") {
            return res.status(401).json({ message: "Não autorizado: token inválido." });
        }
        userService.findByEmail((decoded as JwtPayload).email).then(user => {
            req.user = user;
            next();
        });
    });
}
