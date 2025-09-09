import './config/load-env.js'
console.log("REDIRECT ATUAL:", process.env.GOOGLE_REDIRECT_URI);

console.log(process.env.DATABASE_URL);

import express from "express"
import { sequelize } from  "./database/index.js"
import {adminJs, adminJsRouter} from './adminjs/index.js'
import router from "./routes.js"
import cors from 'cors'
import session from 'express-session';
import { JWT_KEY } from './config/environment.js';
import cookieParser from "cookie-parser";
const app= express()
app.use(session({
  secret:JWT_KEY, // ou outra chave segura
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
    maxAge: 3600000
  }
}));
app.use(cors({
  origin: 'http://esadev.com.br',  // endereço do seu frontend
  credentials: true
}));
app.use(cookieParser())
app.use(express.static('public'))
app.use(adminJs.options.rootPath,adminJsRouter)
app.use(express.json())
app.use(router)
const PORT= process.env.PORT || 3001

app.listen(PORT, ()=>{
    sequelize.authenticate().then(()=>{
        console.log("DB connected seccessfuly")
    })
    console.log(`connected successfully at port ${PORT}`)
})