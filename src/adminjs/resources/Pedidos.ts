import { ResourceOptions } from "adminjs";

const PedidosResourceOptions:ResourceOptions={
navigation:"Comandas",
editProperties:["comandaId",'total','status'],
filterProperties:['id','comandaId','total','status'],
listProperties:['id','comandaId','total','status']
}
export default PedidosResourceOptions