import { UserModel } from "../models/User.js"
import { UserCreationAttributes } from "../models/User.js"

export const userService={
findByEmail:(email:string)=>{
    const user=UserModel.findOne({
        attributes:['id','name','phone','email','password'],
        where:{
            email
        },

    })
    return user
},
create:async(attributes:UserCreationAttributes)=>{
    const user=await UserModel.create(attributes)
    return user
},
findByFacebookId:async(instagramId:string)=>{
    const user=await UserModel.findOne({
        attributes:['id','name','phone','email','password','instagramId'],
        where:{
          instagramId
        }
    
    })
        return user
},
findByLinkedinId:async(linkedinId:string)=>{
    const user=await UserModel.findOne({
        attributes:['id','name','phone','email','password','instagramId','linkedinId'],
        where:{
            linkedinId
        }
    })
    return user
}

}