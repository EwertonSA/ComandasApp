import { Mesas } from "../models"

export const mesasService={
    findAllPaginated: async(page:number,perPage:number)=>{
        const offset=(page - 1)*perPage
        const {rows,count}= await Mesas.findAndCountAll({
            order:[['id','ASC']],
            limit:perPage,
            offset:offset
        })
        return {
            mesas:rows,
            page:page,
            perPage:perPage,
            total:count
        }
    }
}