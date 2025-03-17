import { ResourceOptions } from "adminjs";

const ComandasResourceOptions:ResourceOptions={
navigation:'Comandas',
editProperties:['mesaId','clienteId'],
filterProperties:['id','mesaId','clienteId'],
listProperties:['id','mesaId','clienteId']
}
export default ComandasResourceOptions