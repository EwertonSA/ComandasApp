import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwtService.js";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['clientes-token'];
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
