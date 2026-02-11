import { ResourceOptions } from "adminjs"
const IngredientsResourceOptions:ResourceOptions={
    navigation:"Comandas",
    showProperties:['id','name'],
    editProperties:['name'],
    listProperties:['id','name'],
    filterProperties:['id','name'],

}
export default IngredientsResourceOptions