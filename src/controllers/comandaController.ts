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
  exp?:string
  iat?:string
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
// POST /api/clientComanda
registerClientComanda: async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Não autenticado" });

    const token = authHeader.split(' ')[1];
    const payload = jwtService.verifyTokenState<JWTPayload>(token);
    const { clienteId, mesaId, exp, iat, ...rest } = payload; // remove exp e iat

    const comanda = await comandasService.create({ clienteId, mesaId });

    const newPayload = { ...rest, clienteId, mesaId, comandaId: comanda.id };
    const newToken = jwtService.signToken(newPayload, "7d"); // agora sem conflito

    return res.status(201).json({ id: comanda.id, token: newToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

,

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
    // ✅ Pega os dados direto do middleware
    const { clienteId, comandaId } = (req as any).user;

    if (!clienteId || !comandaId) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Busca a comanda
    const comandaPedido = await comandasService.ComandaPedido(comandaId);

    if (!comandaPedido) {
      return res.status(404).json({ message: 'Comanda não encontrada' });
    }

    // Verifica se o cliente é dono da comanda
    if (comandaPedido.clienteId.toString() !== clienteId.toString()) {
      return res.status(403).json({ message: 'Acesso inválido à comanda' });
    }

    return res.json({
      ...comandaPedido.toJSON(),
      comandaId: comandaPedido.id,
    });
    
  } catch (error) {
    console.error("Erro no showClient:", error);
    return res.status(500).json({ message: 'Erro ao buscar pedidos' });
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