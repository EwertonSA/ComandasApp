import { ProductsIngredients } from "../models/ProductsIngredients.js"
import {ProductIngredientCreationAttibutes} from '../models/ProductsIngredients.js'
export const ProductsIngredientsService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page-1)*perPage
        const {rows,count}=await ProductsIngredients.findAndCountAll({
            order:[['id','ASC']],
            limit:perPage,
            offset:offset
        })
        return{
             ProductsIngredients:rows,
                page:page,
                perPage:perPage,
                total:count
        }
    },
    create:async(params:ProductIngredientCreationAttibutes)=>{
        const res=await ProductsIngredients.create(params)
        return res
    }
}