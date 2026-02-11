// middlewares/adminFrontendMiddleware.js
import { JwtPayload } from "jsonwebtoken";
import { jwtService } from "../services/jwtService.js";
export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'user' | string;
}
export const adminFrontendMiddleware = async (req:any, res:any, next:any) => {
  try {
    let token;

    // tenta Authorization: Bearer
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // tenta cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      // sem token: deixa o AdminJS cuidar do login
      return next();
    }

    const decoded = jwtService.verifyTokenState<TokenPayload>(token);
    if (decoded?.role === "admin") {
      // injeta admin na sessão do AdminJS
      req.session = req.session || {};
      req.session.adminUser = decoded;
      req.user = decoded;

      console.log("✅ Admin autenticado automaticamente via token:", decoded.email);
      return next();
    }

    return res.status(403).send("Acesso negado");
  } catch (err:any) {
    console.error("Erro na verificação do token do AdminJS:", err.message);
    next(); // deixa o AdminJS lidar com o login
  }
};
