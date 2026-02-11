import { Request, Response } from "express"
import { userService } from "../services/userService.js"
import { jwtService } from "../services/jwtService.js"
import { UserModel } from "../models/User.js";
import validateRecaptcha from "../services/recaptcha.js";
import Comandas from "../models/Comandas.js";
import bcrypt from 'bcrypt'
import { clienteService } from "../services/clienteService.js";
import { transporter } from "../config/mailer.js";
export interface AuthenticatedRequest1 extends Request {
  user?: { clienteId: string; email: string; role: string };
  comanda?: InstanceType<typeof Comandas>; // agora o TS aceita req.comanda
}
interface AuthRequest extends Request {
  user?: {
    id: string | number;
    email?: string;
    role?: string;
  };
}
interface DecodedToken {
 comandaId: string;
  clienteId: string;
  nonce?: string; 
}
export const authController={
    register: async (req: Request, res: Response) => {
        const { name, phone, email, password, role } = req.body;
      
        // Defina os tipos de roles permitidos
        const allowedRoles = ["user", "cliente", "admin"];
      
        try {
          // Verifica se o email já existe
          const alreadyExists = await userService.findByEmail(email);
          if (alreadyExists) {
            throw new Error("Email já cadastrado.");
          }
      
          // Verifica se a role enviada é válida
          const finalRole = allowedRoles.includes(role) ? role : "user";
      
          // Cria o usuário com a role correta
          const user = await userService.create({
            name,
            phone,
            email,
            password,
            role: finalRole,
          });
      
          return res.status(201).json(user);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      },
      

loginTest: async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const user = await userService.findByEmail(email);
    console.log("role:", role);

    if (!user) {
      return res.status(404).json({ message: "E-mail não registrado" });
    }

    const isSame = await user.checkPassword(password);
    if (!isSame) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    console.log("userRole:", user.role);

    if (role !== user.role) {
      return res
        .status(403)
        .json({ message: "Tipo de login incorreto para este usuário" });
    }

    if (!user.two_factor_enabled) {
      const { qrCodeDataURL } = await userService.setup2fa(user.id.toString());
      return res.json({
        twoFARequired: true,
        qrCodeDataURL,
        userId: user.id,
      });
    }

    return res.json({
      twoFARequired: true,
      message: "Informe o código do Authenticator",
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
},


// verify 2FA
verify2FA: async (req: Request, res: Response) => {
  const { token, userId } = req.body;
  console.log("Recebido no backend verify2FA:", req.body);

  try {
    // 1. Verifica o 2FA
    const isValid = await userService.verify2fa(token, userId.toString());
    if (!isValid) {
      return res.status(401).json({ message: "Código 2FA inválido" });
    }

    // 2. Busca usuário
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // 3. Gera JWT apenas após 2FA válido
    const jwt = jwtService.signToken(
      { id: user.id, email: user.email, role: user.role },
      "1d"
    );

    // 🔹 Configuração híbrida de cookie
 const isProd = process.env.NODE_ENV === "production";

res.cookie("comandas-token", jwt, {
  httpOnly: true,
  secure: isProd? true:false, 
  sameSite:isProd?'strict':'lax', 
   domain: isProd? '.esadev.com.br': undefined,
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});

    return res.status(200).json({
      authenticated: true,jwt,
      user: { id: user.id, email: user.email, role: user.role },  
     
    });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
},
reset2fa:async(req:Request,res:Response)=>{
const {userId}=req.body
const { qrCodeDataURL } = await userService.reset2fa(userId.toString());
return res.json({ qrCodeDataURL, message: "Novo QR gerado" });
},
verifyState: async (req: Request, res: Response) => {
  const { comandaId } = req.params;
  const { state } = req.query;

  if (!state) return res.json({ valid: false });

  try {
    // Decodifica o token state da query
    const decoded = jwtService.verifyTokenState<DecodedToken>(state as string);

    // Busca a comanda no banco
    const comanda = await Comandas.findByPk(comandaId);

    // Valida se a comanda existe e corresponde ao token
    if (!comanda || decoded.comandaId !== comandaId) {
      return res.json({ valid: false });
    }

    // Cria o token de sessão com clienteId e comandaId
    const sessionToken = jwtService.signToken({
      clienteId: decoded.clienteId,
      comandaId: decoded.comandaId
    }, '4h'); // expira em 4h

    // Log correto usando o clienteId do decoded
    console.log({
      tokenClienteId: decoded.clienteId,
      comandaId: decoded.comandaId,
    });

    // Seta o cookie de sessão
    res.cookie('clientes-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 4,
      domain: process.env.NODE_ENV === 'production' ? '.esadev.com.br' : undefined,
    });

    return res.json({ valid: true });

  } catch (err) {
    console.error("Erro ao verificar state:", err);
    return res.json({ valid: false });
  }
},


// POST /api/auth/autoLogin
// 1️⃣ AutoLogin
autoLogin: async (req: Request, res: Response) => {
  const { email, nome, mesaId } = req.body;
  const password = "123456"; // senha fixa demo

  if (!email) return res.status(400).json({ message: "Email obrigatório" });

  try {
    let user = await userService.findByEmail(email);
    if (!user) {
      user = await userService.create({ email, password, role: "cliente" });
    }

    const payload = { clienteId: user.id, email: user.email, role: user.role, mesaId };
    const token = jwtService.signToken(payload, "7d");

    return res.json({ authenticated: true, token, ...payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
 ,           logout:async(req:Request,res:Response)=>{
              try {
                res.clearCookie(
                  'clientes-token',{
                     httpOnly: true,
                     secure: true,
                     sameSite: 'lax', 
                     path: '/', 
                  }
                )
                  return res.status(200).json({ message: "Logout realizado com sucesso" });
              } catch (error) {
                console.error("Erro ao realizar o logout")
                 return res.status(500).json({ error: "Erro no logout" });
              }
            },
        forgotPassword : async (req: Request, res: Response) => {
  try {
    const { email } = req.body; // <- destrutura o email corretamente

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório." });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // 🔹 Cria token válido por 1 hora
    const token = jwtService.signToken({ id: user.id, email }, "1h");

    // 🔹 Monta link de redefinição
    const resetLink = `http://localhost:3000/login/updatepassword?token=${token}`;

    // 🔹 Envia e-mail
    await transporter.sendMail({
      from: `"ComandasApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Redefinição de senha - ComandasApp",
      html: `
        <h3>Olá ${user.name || "usuário"},</h3>
        <p>Você solicitou a redefinição da sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha. O link expira em 1 hora:</p>
        <a href="${resetLink}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Redefinir senha
        </a>
        <br/><br/>
        <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
      `,
    });

    console.log(`🔗 Link de redefinição enviado para ${email}`);

    return res.status(200).json({ message: "E-mail de recuperação enviado com sucesso!" });
  }catch (error: any) {
  console.error("Erro ao solicitar redefinição:", error.message, error.stack);
  return res.status(500).json({ error: error.message || "Erro interno do servidor." });
}
},
    updatePassword: async (req:Request, res:Response) => {
  const { id } = (req as any).user; // <- já vem do middleware
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword)
    return res.status(400).json({ error: "Preencha todos os campos." });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ error: "As senhas não coincidem." });

  const user = await UserModel.findByPk(id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

  user.password = newPassword;
  await user.save();

  return res.status(200).json({ message: "Senha atualizada com sucesso!" });
}


    }