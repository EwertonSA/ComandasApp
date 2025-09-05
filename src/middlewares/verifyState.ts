import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwtService.js";


const validateClientAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Pega token do header Authorization ou do cookie
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies["clientes-token"]) {
    token = req.cookies["clientes-token"];
  }

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    const decoded = jwtService.verifyTokenState<{
      comandaId: string;
      clienteId: string;
    }>(token);

const routeComandaId = String(req.params.comandaId);

if (!decoded.comandaId || String(decoded.comandaId) !== routeComandaId) {
  console.log('clienteId:', decoded.clienteId, 'comandaId:', decoded.comandaId);
  return res.status(403).json({ message: "Acesso negado à comanda" });
}

    // Injeta dados no req
    (req as any).clienteId = decoded.clienteId;
    (req as any).comandaId = decoded.comandaId;

    return next();
  } catch (err) {
    console.error("Erro ao validar token:", err);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

export default validateClientAccess;
