import AdminJS from 'adminjs';
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from '@adminjs/sequelize'
import { sequelize } from '../database';
import { adminJsResources } from './resources';
import { DashboarOptions } from './resources/dashboard';

AdminJS.registerAdapter(AdminJSSequelize)

export const adminJs= new AdminJS({
    databases:[sequelize],
    rootPath:'/admin',
    resources:adminJsResources,
    dashboard:DashboarOptions

})
export const adminJsRouter =AdminJSExpress.buildRouter(adminJs)