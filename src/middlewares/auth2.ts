import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwtService.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
try {
let token=
req.cookies['comandas-token'];
if (!token && req.headers.authorization) {
token = req.headers.authorization.split(' ')[1];
}

if (!token) {
return res.status(401).json({ message: "Token não encontrado" });
}
const payload = jwtService.verifyTokenState(token);
(req as any).user = payload; // injeta user no req
next();
} catch (err) {
return res.status(401).json({ message: "Token inválido" });
}
};
