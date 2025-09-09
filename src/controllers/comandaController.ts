import { Request, Response } from "express";
import { comandasService } from "../services/comandasService.js";
import { getPaginationParams } from "../helpers/getPaginationParams.js";
import { AuthenticatedRequest } from "../middlewares/auth.js";
import Comandas from "../models/Comandas.js";
import { clienteService } from "../services/clienteService.js";
import { jwtService } from "../services/jwtService.js";
type JWTPayload = {
  clienteId: number;
  mesaId: number;
  email: string;
  role: string;
};

export const comandaController={
  index: async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const [page, perPage] = getPaginationParams(req.query);

    if (!userId) {
        return res.status(401).json({ message: "Não autorizado" });
    }

    try {
        const paginated = await comandasService.findAllPaginated(userId, page, perPage);
        return res.json(paginated);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
    }},
registerClientComanda: async (req: Request, res: Response) => {
  try {
    const token = req.cookies["clientes-token"]; 
    if (!token) return res.status(401).json({ error: "Não autenticado" });

    const payload = jwtService.verifyTokenState<JWTPayload>(token);
    const { clienteId, mesaId } = payload;

    // cria a comanda
    const comanda = await comandasService.create({ clienteId, mesaId });

    // monta um novo payload com comandaId
    const newPayload = { ...payload, comandaId: comanda.id };

    // assina um novo token
    const newToken = jwtService.signToken(newPayload, "7d");

    // sobrescreve o cookie com o token atualizado
    res.cookie("clientes-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
console.log("tokenComandaID:",newPayload.comandaId)
    return res.status(201).json({ id: comanda.id });
  } catch (error) {
    console.error("Erro ao registrar comanda:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
},


    show:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
            const comandaPedido= await comandasService.ComandaPedido(id)
            return res.json(comandaPedido)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
showClient: async (req: Request, res: Response) => {
  try {
    // Pega o token do cookie ou do header
    let token = req.cookies['clientes-token'];
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) return res.status(401).json({ message: 'Acesso não autorizado' });

    // Decodifica o token de sessão
    const decoded = jwtService.verifyTokenState<{ clienteId: string, comandaId: string }>(token);
    const clienteId = decoded.clienteId;
    const comandaId = decoded.comandaId;



    const comandaPedido = await comandasService.ComandaPedido(comandaId);
console.log("Decoded clienteId:", clienteId);
console.log("ComandaPedido.clienteId:", comandaPedido?.clienteId);
    if (!comandaPedido || comandaPedido.clienteId.toString() !== clienteId) {
      return res.status(403).json({ message: 'Acesso inválido à comanda' });
    }

    // Retorna o objeto incluindo o comandaId explicitamente
    return res.json({
      ...comandaPedido.toJSON(),
      comandaId: comandaPedido.id
    });

  } catch (error) {
    console.error("Erro no showClient:", error);
    return res.status(400).json({ message: 'Erro ao buscar pedidos' });
  }
}
,


    showPayed:async(req:Request,res:Response)=>{
        try {
            const payed=await comandasService.comandaAtiva()
            return res.json(payed)    
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
        
    },
    save:async(req:Request,res:Response)=>{
        const{mesaId,clienteId}=req.body
        try {
            const comanda= await comandasService.create({
                mesaId,clienteId
            })
            return res.status(200).json(comanda)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    update:async(req:Request,res:Response)=>{
        const {id}=req.params
        const {mesaId,clienteId}=req.body
        try {
            await comandasService.update(id,{mesaId,clienteId})
            return res.status(204).send
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    delete:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
           await comandasService.delete(id) 
            return res.status(204).send()
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    }

}