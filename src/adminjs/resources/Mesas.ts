import { ResourceOptions } from "adminjs";

export const MesasResourceOptions: ResourceOptions={
    navigation:"Comandas",
    editProperties:['numero','capacidade'],
    filterProperties:['numero','capacidade','createdAt','updatedAt'],
    listProperties:['id','numero','capacidade']
}