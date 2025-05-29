import {  Clientes } from "./Cliente.js";
import { Comandas } from "./Comandas.js";
import { Mesas } from "./Mesas.js";
import Pagamentos from "./Pagamentos.js";
import Pedidos from "./Pedidos.js";
import PedidosProdutos from "./pedidosProdutos.js";
import Produtos from "./Produtos.js";
import { UserModel } from "./User.js";

// Relação Mesa - Clientes (1:N)
Mesas.hasMany(Clientes, {as:'clientes', foreignKey: 'mesaId' });
Clientes.belongsTo(Mesas, { foreignKey: 'mesaId' });

// Relação Mesa - Comandas (1:N)
Mesas.hasMany(Comandas, { foreignKey: 'mesaId' });
Comandas.belongsTo(Mesas, { foreignKey: 'mesaId' });

// Relação Cliente - Comandas (1:N)
Clientes.hasOne(Comandas, {as:'comandas', foreignKey: 'clienteId' });
Comandas.belongsTo(Clientes, { foreignKey: 'clienteId' });

// Relação Comanda - Pedidos (1:N)
Comandas.hasMany(Pedidos, { foreignKey: 'comandaId' });
Pedidos.belongsTo(Comandas, { foreignKey: 'comandaId' });

// Relação Pedido - Produtos (N:M) através da tabela intermediária PedidoProdutos
Pedidos.belongsToMany(Produtos, {
    through: PedidosProdutos,
    as:'produtos', // Especificando a tabela intermediária
    foreignKey: 'pedidoId', // Chave estrangeira para Pedidos
  
  });
Produtos.belongsToMany(Pedidos, { through: PedidosProdutos,as:'pedidos', foreignKey: 'produtoId' });

// Relação PedidoProdutos - Pedido (1:N)
PedidosProdutos.belongsTo(Pedidos, { foreignKey: 'pedidoId', as:'pedido'});
Pedidos.hasMany(PedidosProdutos, { foreignKey: 'pedidoId', as:'pedidosProdutos'});

// Relação PedidoProdutos - Produto (1:N)
PedidosProdutos.belongsTo(Produtos, { foreignKey: 'produtoId', as:'produto' });
Produtos.hasMany(PedidosProdutos, { foreignKey: 'produtoId',as:'produtos' });

// Relação comanda - Pagamento (1:1)
Comandas.hasOne(Pagamentos, { foreignKey: 'comandaId' });
Pagamentos.belongsTo(Comandas, { foreignKey: 'comandaId' });

// Exporte os modelos para que eles possam ser usados em outros arquivos
export {
    Clientes,
    Comandas,
    Mesas,
    Pagamentos,
    Pedidos,
    PedidosProdutos,
    Produtos,
    UserModel
};
