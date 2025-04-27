import { UserModel } from "../models"
import { UserCreationAttributes } from "../models/User"

export const userService={
findByEmail:async(email:string)=>{
    const user=await UserModel.findOne({
        where:{
            email
        },
        attributes: ['id', 'name', 'phone', 'email', 'password', 'role'] 
    })
    return user
},
create:async(attributes:UserCreationAttributes)=>{
    const user=await UserModel.create(attributes)
    return user
}
}