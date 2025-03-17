import { ResourceWithOptions } from "adminjs";
import { Clientes } from "../../models/Cliente";
import { ClienteResourceOptions } from "./Cliente";
import { Mesas } from "../../models/Mesas";
import { MesasResourceOptions } from "./Mesas";
import { Comandas, Pagamentos, Pedidos, PedidosProdutos, Produtos } from "../../models";
import ComandasResourceOptions from "./Comandas";
import PedidosResourceOptions from "./Pedidos";
import ProdutosResourceOption from "./Produtos";
import PedidosProdutosResourceOptions from "./PedidosProdutos";
import PagamentosResourceOptions from "./Pagamentos";

export const adminJsResources: ResourceWithOptions[]=[{
    resource:Clientes,
    options: ClienteResourceOptions
},{
    resource:Mesas,
    options:MesasResourceOptions
},{
    resource:Comandas,
    options:ComandasResourceOptions
},
{
    resource:Pedidos,
    options:PedidosResourceOptions
},
{
    resource:Produtos,
    options:ProdutosResourceOption
},{
    resource:PedidosProdutos,
    options:PedidosProdutosResourceOptions
},{
    resource:Pagamentos,
    options:PagamentosResourceOptions
}
]