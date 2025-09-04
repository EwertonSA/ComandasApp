import { Request, Response } from "express";
import { comandasService } from "../services/comandasService.js";
import { getPaginationParams } from "../helpers/getPaginationParams.js";
import { AuthenticatedRequest } from "../middlewares/auth.js";
import Comandas from "../models/Comandas.js";
import { clienteService } from "../services/clienteService.js";
import { jwtService } from "../services/jwtService.js";

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
registerClientComanda:async(req:Request,res:Response)=>{
try {
    const {clienteId,mesaId}=req.body
const comanda=await  comandasService.create({clienteId,mesaId})
const state=await clienteService.generateClienteState(clienteId,comanda.id.toString())
  return res.status(201).json({ id: comanda.id, state });
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
    // Primeiro tenta pegar do cookie
    let token = req.cookies['clientes-token'];

    // Se não tiver cookie, tenta pegar do header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization; // "Bearer <token>"
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) return res.status(401).json({ message: 'Acesso não autorizado' });

    // Decodifica e valida assinatura
    const { clienteId, comandaId } = jwtService.verifyTokenState<{ clienteId: string, comandaId: string }>(token);
    console.log('getclienteId:', clienteId, 'getcomandaId:', comandaId);

    const comandaPedido = await comandasService.ComandaPedido(comandaId);

    // Verifica se a comanda pertence ao cliente
    if (!comandaPedido || comandaPedido.clienteId.toString() !== clienteId) {
      return res.status(403).json({ message: 'Acesso inválido à comanda' });
    }

    // Constrói objeto para frontend garantindo comandaId
    const response = {
      ...comandaPedido.toJSON(), // transforma em objeto plano
      comandaId: comandaPedido.id,
    };

    console.log({ tokenClienteId: clienteId, comandaId, comandaPedidoClienteId: comandaPedido?.clienteId });

    return res.json(response);

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