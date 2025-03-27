import { Produtos } from "../models"
import { ProdutoAttributes } from "../models/Produtos"

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
    },
    create:async(attributes:ProdutoAttributes)=>{
        const produto=await Produtos.create(attributes)
        return produto
    },
    update:async(id:string,attributes:{nome:string,descricao:string,preco:number,categoria:string})=>{
        const updated=await Produtos.update(attributes,{where:{id},returning:true})
        return updated
    },
    delete:async(id:string)=>{
        const deleted=await Produtos.destroy({where:{id}})
        return deleted
    }
}