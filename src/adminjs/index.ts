import AdminJS from 'adminjs';
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from '@adminjs/sequelize'
import { sequelize } from '../database';
import { adminJsResources } from './resources';
import { DashboarOptions } from './resources/dashboard';
import { UserModel } from '../models';
import bcrypt from 'bcrypt';

AdminJS.registerAdapter(AdminJSSequelize)

export const adminJs= new AdminJS({
    databases:[sequelize],
    rootPath:'/admin',
    resources:adminJsResources,
    dashboard:DashboarOptions

})
export const adminJsRouter =AdminJSExpress.buildAuthenticatedRouter(adminJs,{
    authenticate:async(email,password)=>{
const user= await UserModel.findOne({where:{email}})
if(user?.password&& user.role === 'user'){
    const matched=await bcrypt.compare(password,user.password)
    if(matched){
        return user
    }
}
return false
    },
    cookiePassword:'senha'
},null,{
    resave:false,
    saveUninitialized:false
})