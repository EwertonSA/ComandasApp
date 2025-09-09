import { Request, Response } from "express"
import { userService } from "../services/userService.js"
import { jwtService } from "../services/jwtService.js"
import { UserModel } from "../models/User.js";
import validateRecaptcha from "../services/recaptcha.js";
import { AuthenticatedRequest } from "../middlewares/auth.js";
import Comandas from "../models/Comandas.js";
export interface AuthenticatedRequest1 extends Request {
  user?: { clienteId: string; email: string; role: string };
  comanda?: InstanceType<typeof Comandas>; // agora o TS aceita req.comanda
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
      
  login: async (req: Request, res: Response) => {
     const { email, password,recaptchaToken } = req.body;
      const recaptchaResult = await validateRecaptcha(recaptchaToken);
  if (!recaptchaResult.success) {
    return res.status(400).json({ message: "Falha na verificação do reCAPTCHA" });
  }
 
  const user = await userService.findByEmail(email);
  if (!user) return res.status(404).json({ message: "E-mail não registrado" });

  user.checkPassword(password, async (err, isSame) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!isSame) return res.status(401).json({ message: "Senha incorreta!" });

    if (!user.two_factor_enabled) {
      const { qrCodeDataURL } = await userService.setup2fa(user.id.toString());
      return res.json({ twoFARequired: true, qrCodeDataURL, userId: user.id });
    }

    return res.json({ twoFARequired: true, message: "Informe o código do Authenticator", userId: user.id });
  });
},

// verify 2FA
verify2FA: async (req: Request, res: Response) => {
  const { token, userId } = req.body;

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
      { id: user.id, email: user.email },
      "7d"
    );

    return res.json({
      authenticated: true,
      token: jwt,
      user: { id: user.id, email: user.email } // opcional
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


          autoLogin: async (req: Request, res: Response) => {
              console.log("Body recebido:", req.body);
              const { email} = req.body;
            const password='123456'
              if (!email) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios' });
              }
            
              try {
                let user = await userService.findByEmail(email);
            
                if (!user) {
                  // Usuário não existe: cria automaticamente
                  user = await userService.create({ email, password ,role:'cliente'});
                } else {
                  // Usuário já existe: verifica a senha
                  const isSame = await new Promise<boolean>((resolve, reject) => {
                    user!.checkPassword(password, (err: any, result: boolean) => {
                      if (err) return reject(err);
                      resolve(result);
                    });
                  });
            
                  if (!isSame) {
                    return res.status(401).json({ message: 'Senha incorreta!' });
                  }
                }
            
                // Gera token e retorna
               const payload = { 
  clienteId: user.id, 
  email: user.email,
  role: user.role 
};

const token = jwtService.signToken(payload, '7d');

// Cria cookie HTTP-only
res.cookie('clientes-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true se estiver em HTTPS
  sameSite: 'lax', // "none" se for cross-site com https
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
});

// Retorna os dados do usuário (não precisa retornar token, já está no cookie)
return res.json({ authenticated: true, ...payload });

            
              } catch (error) {
                console.error("Erro no login/cadastro:", error);
                return res.status(500).json({ message: 'Erro interno do servidor' });
              }
            },
            logout:async(req:Request,res:Response)=>{
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
            }
            
      
}
