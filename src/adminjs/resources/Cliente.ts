import { ResourceOptions } from "adminjs";
import { clienteService } from "../../services/clienteService";

export const ClienteResourceOptions: ResourceOptions = {
  navigation: "Comandas",
  editProperties: ["nome", "telefone", "mesaId"],
  filterProperties: ["id", "nome", "telefone", "mesaId"],
  listProperties: ["id", "nome", "telefone", "mesaId"],

  actions: {
    new: {
      before: async (request) => {
     
        if (!request.payload) {
          throw new Error("Payload inválido.");
        }

        const { nome, telefone, mesaId } = request.payload as any;

        try {
          const cliente = await clienteService.create({ nome, telefone, mesaId });
    
          return { ...request, payload: { ...request.payload, ...cliente.get() } };
        } catch (error) {
          throw new Error( "Erro ao criar cliente.");
        }
      }
    }
  }
};

