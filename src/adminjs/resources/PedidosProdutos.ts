import { ResourceOptions } from "adminjs";

const PedidosProdutosResourceOptions: ResourceOptions = {
  navigation: "Comandas", // Organiza na aba Comandas

  showProperties: ["id", "pedidoId", "produtoId", "quantidade", "createdAt"],
  editProperties: ["pedidoId", "produtoId", "quantidade"],
  listProperties: ["id", "pedidoId", "produtoId", "quantidade"],
  filterProperties: ["pedidoId", "produtoId", "quantidade"],

  properties: {
    pedidoId: {
      reference: "pedidos", // Conecta corretamente ao AdminJS
    },
    produtoId: {
      reference: "produtos",
    },
  },
};

export default PedidosProdutosResourceOptions;
