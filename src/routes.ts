import express from 'express'
import { mesasController } from './controllers/mesasController'
import { clientesController } from './controllers/clienteController'
import { pedidosController } from './controllers/pedidosController'
import { comandaController } from './controllers/comandaController'
import { productController } from './controllers/productController'
import { pedidosProdutosController } from './controllers/pedidosProdutosController'
import { pagamentoController } from './controllers/pagamentoController'
import { clienteService } from './services/clienteService'
const router= express.Router()
router.get('/mesas',mesasController.index)
router.post('/mesas',mesasController.save)
router.put('/mesas/:id',mesasController.update)
router.get('/mesas/:id',mesasController.show)
router.delete('/mesas/:id',mesasController.delete)

router.get('/clientes',clientesController.index)
router.post('/clientes',clientesController.registro)
router.put('/clientes/:id',clientesController.update)
router.get('/clientes/:id',clientesController.show)
router.delete('/clientes/:id/:mesaId',clientesController.delete)

router.post('/comandas',comandaController.save)
router.get('/comandas/:id',comandaController.show)
router.put('/comandas/:id',comandaController.update)
router.delete('/comandas/:id',comandaController.delete)

router.get('/pedidos',pedidosController.index)
router.get('/pedidos/:id',pedidosController.show)
router.post('/pedidos',pedidosController.save)

router.get('/produtos',productController.index)
router.post('/produtos',productController.save)

router.post('/pedidosProdutos', pedidosProdutosController.save);

router.post('/pagamentos',pagamentoController.save)
export default router
