import { Ingredients, IngredientsCreationAttributes } from "../models/ingredients_temp.js"

export const IngredientService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page-1)*perPage
        const {rows,count}=await Ingredients.findAndCountAll(
            {
                order:[['id','ASC']],
                limit:perPage,
                offset:offset
            
            })
            return{
                Ingredients:rows,
                page:page,
                perPage:perPage,
                total:count
            }
    },
    findById:async(id:string)=>{
const ingredient=await Ingredients.findByPk(id,{
    attributes:['id','name'],
    include:{
        association:'produtos',
        attributes:['id','nome','preco']
    }
    
})
console.log('IngredienteNoService:',ingredient)
return ingredient
    },
    create:async(param:{name:string})=>{
        const ingredient= await Ingredients.create(param)
        return ingredient
    },
    
    update:async(id:string,params:{name:string})=>{
const ingredient=await Ingredients.update(params,{
    where:{id},
    returning: true
})
return ingredient
    }
}