import './config/load-env.js'

console.log(process.env.DATABASE_URL);

import express from "express"
import { sequelize } from  "./database/index.js"
import {adminJs, adminJsRouter} from './adminjs/index.js'
import router from "./routes.js"
import cors from 'cors'
const app= express()
app.use(cors())
app.use(express.static('public'))
app.use(adminJs.options.rootPath,adminJsRouter)
app.use(express.json())
app.use(router)
const PORT= process.env.PORT || 3000

app.listen(PORT, ()=>{
    sequelize.authenticate().then(()=>{
        console.log("DB connected seccessfuly")
    })
    console.log(`connected successfully at port ${PORT}`)
})