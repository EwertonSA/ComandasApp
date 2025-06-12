import { ResourceWithOptions } from "adminjs";
import { Clientes } from "../../models/Cliente.js";
import { ClienteResourceOptions } from "./Cliente.js";
import { Mesas } from "../../models/Mesas.js";
import { MesasResourceOptions } from "./Mesas.js";
import { Comandas} from "../../models/Comandas.js"

import ComandasResourceOptions from "./Comandas.js";
import PedidosResourceOptions from "./Pedidos.js";
import ProdutosResourceOption, { thumbnailResourceFeatures } from "./Produtos.js";
import PedidosProdutosResourceOptions from "./PedidosProdutos.js";
import PagamentosResourceOptions from "./Pagamentos.js";
import { UserResourceOptions } from "./users.js";
import Pedidos from "../../models/Pedidos.js";
import Produtos from "../../models/Produtos.js";
import PedidosProdutos from "../../models/pedidosProdutos.js";
import Pagamentos from "../../models/Pagamentos.js";
import { UserModel } from "../../models/User.js";


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
    options:ProdutosResourceOption,
    features:thumbnailResourceFeatures
},{
    resource:PedidosProdutos,
    options:PedidosProdutosResourceOptions
},{
    resource:Pagamentos,
    options:PagamentosResourceOptions
},
{
    resource:UserModel,
    options:UserResourceOptions
}
]