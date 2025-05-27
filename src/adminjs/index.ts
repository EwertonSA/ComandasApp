import AdminJS from 'adminjs';
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from '@adminjs/sequelize'
import { sequelize } from '../database';
import { adminJsResources } from './resources';
import { componentLoader } from './resources/dashboard';
import { UserModel } from '../models';
import bcrypt from 'bcrypt';
import {DashboarOptions} from './resources/dashboard';
import { ADMINJS_COOKIE_PASSWORD } from '../config/environment';
import session from 'express-session'
import connectSession from 'connect-session-sequelize'
const SequelizeStore=connectSession(session.Store)
const store= new SequelizeStore({db:sequelize})
store.sync()
AdminJS.registerAdapter(AdminJSSequelize)

export const adminJs= new AdminJS({
    databases:[sequelize],
    rootPath:'/admin',
    resources:adminJsResources,
    dashboard:DashboarOptions,
    componentLoader

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
    cookiePassword:ADMINJS_COOKIE_PASSWORD
},null,{
    resave:false,
    saveUninitialized:false,
    store:store,
    secret:ADMINJS_COOKIE_PASSWORD
})