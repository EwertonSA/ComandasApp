import express from 'express'
import { mesasController } from './controllers/mesasController'
import { clientesController } from './controllers/clienteController'
import { pedidosController } from './controllers/pedidosController'
import { comandaController } from './controllers/comandaController'
import { productController } from './controllers/productController'
const router= express.Router()
router.get('/mesas',mesasController.index)
router.post('/mesas',mesasController.save)
router.get('/mesas/:id',mesasController.show)

router.get('/clientes',clientesController.index)
router.post('/clientes',clientesController.registro)
router.get('/clientes/:id',clientesController.show)

router.post('/comandas',comandaController.save)
router.get('/comandas/:id',comandaController.show)

router.get('/pedidos',pedidosController.index)

router.get('/produtos',productController.index)
export default router
