import {  Clientes } from "./Cliente";
import { Comandas } from "./Comandas";
import { Mesas } from "./Mesas";
import Pagamentos from "./Pagamentos";
import Pedidos from "./Pedidos";
import PedidosProdutos from "./pedidosProdutos";
import Produtos from "./Produtos";

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
Pedidos.belongsToMany(Produtos, { through: PedidosProdutos, foreignKey: 'pedidoId' });
Produtos.belongsToMany(Pedidos, { through: PedidosProdutos, foreignKey: 'produtoId' });

// Relação PedidoProdutos - Pedido (1:N)
PedidosProdutos.belongsTo(Pedidos, { foreignKey: 'pedidoId' });
Pedidos.hasMany(PedidosProdutos, { foreignKey: 'pedidoId' });

// Relação PedidoProdutos - Produto (1:N)
PedidosProdutos.belongsTo(Produtos, { foreignKey: 'produtoId' });
Produtos.hasMany(PedidosProdutos, { foreignKey: 'produtoId' });

// Relação Pedido - Pagamento (1:1)
Pedidos.hasOne(Pagamentos, { foreignKey: 'pedidoId' });
Pagamentos.belongsTo(Pedidos, { foreignKey: 'pedidoId' });

// Exporte os modelos para que eles possam ser usados em outros arquivos
export {
    Clientes,
    Comandas,
    Mesas,
    Pagamentos,
    Pedidos,
    PedidosProdutos,
    Produtos
};
