import { ResourceOptions } from "adminjs";

export const ClienteResourceOptions: ResourceOptions={
    navigation:"Comandas",
    editProperties:['nome','telefone'],
    filterProperties:['nome','telefone','createdAt','updatedAt'],
    listProperties:['id','nome','telefone']
}