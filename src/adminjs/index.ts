
import express from 'express'
import session from 'express-session'

import SequelizeStoreFactory from 'connect-session-sequelize'

import bcrypt from 'bcrypt'
import { sequelize } from '../database/index.js'
import { UserModel } from '../models/User.js'
import AdminJS from 'adminjs'
import AdminJSSequelize from '@adminjs/sequelize'
import { dashboardOptions } from './resources/dashboard.js'
import { componentLoader } from './resources/dashboard.js'
import { ADMINJS_COOKIE_PASSWORD, DATABASE_URL, JWT_KEY } from '../config/environment.js'
AdminJS.registerAdapter(AdminJSSequelize)

const app = express()
const SequelizeStore = SequelizeStoreFactory(session.Store)

const store = new SequelizeStore({ db: sequelize })
await store.sync()

export const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  dashboard: dashboardOptions, 
  componentLoader,

  branding: {
    companyName: 'Seu Painel Admin',
     theme: {
    colors: {
      background: '#ffffff',
      text: '#151515',
      border: '#cccccc',
      tableHeader: '#f4f4f4',
    },
    
  }
  }
})

// ⚠️ Importação dinâmica de buildAuthenticatedRouter
const { buildAuthenticatedRouter } = await import('@adminjs/express')

export const adminJsRouter = buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await UserModel.findOne({ where: { email } })
    if (user && user.role === 'user') {
      const matched = await bcrypt.compare(password, user.password)
      if (matched) return user
    }
    return false
  },
  cookiePassword:ADMINJS_COOKIE_PASSWORD
}, null,{
  resave:false
, 
saveUninitialized:false,
store:store,
secret:ADMINJS_COOKIE_PASSWORD
})
