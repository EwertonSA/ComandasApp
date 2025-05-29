import { ResourceOptions } from "adminjs";
import { comandasService } from "../../services/comandasService.js";

const ComandasResourceOptions:ResourceOptions={
navigation:'Comandas',
editProperties:['mesaId','clienteId'],
filterProperties:['id','mesaId','clienteId'],
listProperties:['id','mesaId','clienteId'],
actions: {
    new: {
      before: async (request) => {
        if (!request.payload) return request;

        const { mesaId, clienteId } = request.payload as any;

        try {
          // Tenta criar a comanda pelo serviço que já faz as validações
          const comanda = await comandasService.create({ mesaId, clienteId });

          // Retorna os dados da comanda para o AdminJS
          request.payload = { ...request.payload, ...comanda.get() };
          return request;
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Erro ao criar comanda");
        }
      }
    }
  }
}
export default ComandasResourceOptions