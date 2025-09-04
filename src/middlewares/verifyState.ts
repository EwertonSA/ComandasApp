import { NextFunction, Request, Response } from "express";
import Comandas from "../models/Comandas.js";


const validateClientAccess= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const token = req.cookies["clientes-token"];

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    const parsed = JSON.parse(token);
    const { comandaId, clienteId } = parsed;
    const routeComandaId = req.params.comandaId;

    if (!comandaId || comandaId !== routeComandaId) {
      return res.status(403).json({ message: "Acesso negado à comanda" });
    }

    // Injeta dados do usuário para uso posterior
    (req as any).clienteId = clienteId;
    (req as any).comandaId = comandaId;

    return next();
  } catch (err) {
    console.error("Erro ao validar cookie:", err);
    return res.status(401).json({ message: "Token inválido" });
  }
}
export default validateClientAccess