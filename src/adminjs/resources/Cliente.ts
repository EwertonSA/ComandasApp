import { ResourceOptions } from "adminjs";

export const ClienteResourceOptions: ResourceOptions={
    navigation:"Comandas",
    editProperties:['nome','telefone','mesaId'],
    showProperties:['nome','telefone','mesaId','createdAt','updatedAt'],
    filterProperties:['nome','telefone','mesaId','createdAt','updatedAt'],
    listProperties:['id','nome','telefone','mesaId']
}