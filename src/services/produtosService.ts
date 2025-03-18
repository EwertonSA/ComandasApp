import { Produtos } from "../models"

export const produtoService={
    finadAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page-1)*perPage
        const {rows,count}=await Produtos.findAndCountAll({
            order:[['id','ASC']],
            limit:perPage,
            offset
        })
        return {
            produtos:rows,
            page,
            perPage,
            total:count
        }
    }
}