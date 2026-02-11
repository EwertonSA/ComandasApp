import { ResourceOptions } from "adminjs";

const ProductsIngredientsResourceOptions:ResourceOptions={
    navigation:"Comandas",
    showProperties:['id','produtoId','ingredientId','optional'],
    listProperties:['id','produtoId','ingredientId','optional'],
    editProperties:['produtoId','ingredientId','optional'],
    filterProperties:['id','produtoId','ingredientId','optional'],
    properties:{
        ingredientId:{
            reference:'ingredients'
        },
        produtoId:{
            reference:'produtos'
        }
    }

}
export default ProductsIngredientsResourceOptions