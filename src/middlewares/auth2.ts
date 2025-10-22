import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwtService.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Tenta pegar do cookie
   let token=
  
      req.cookies['comandas-token'];

    // 2️⃣ Se não achar no cookie, tenta no header Authorization
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 3️⃣ Se não achou em nenhum lugar, bloqueia
    if (!token) {
      return res.status(401).json({ message: "Token não encontrado" });
    }

    // 4️⃣ Valida o token
    const payload = jwtService.verifyTokenState(token);
    (req as any).user = payload; // injeta user no req
console.log("Decoded JWT payload:", payload);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
