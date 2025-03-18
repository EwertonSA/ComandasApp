import express from 'express'
import { mesasController } from './controllers/mesasController'
const router= express.Router()
router.get('/mesas',mesasController.index)
export default router
