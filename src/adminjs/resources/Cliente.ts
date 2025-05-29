import { ResourceOptions } from "adminjs";
import { clienteService } from "../../services/clienteService.js";

export const ClienteResourceOptions: ResourceOptions = {
  navigation: "Comandas",
  editProperties: ["nome", "mesaId"],
  filterProperties: ["id", "nome", "mesaId"],
  listProperties: ["id", "nome", "mesaId"],

  actions: {
    new: {
      before: async (request) => {
     
        if (!request.payload) {
          throw new Error("Payload inválido.");
        }

        const { nome, telefone, mesaId } = request.payload as any;

        try {
          const cliente = await clienteService.create({ nome, mesaId });
    
          return { ...request, payload: { ...request.payload, ...cliente.get() } };
        } catch (error) {
          throw new Error( "Erro ao criar cliente.");
        }
      }
    }
  }
};

