import express from 'express'
import { mesasController } from './controllers/mesasController'
import { clientesController } from './controllers/clienteController'
import { pedidosController } from './controllers/pedidosController'
import { comandaController } from './controllers/comandaController'
import { productController } from './controllers/productController'
import { pedidosProdutosController } from './controllers/pedidosProdutosController'
import { pagamentoController } from './controllers/pagamentoController'
import { authController } from './controllers/authController'

const router= express.Router()
router.post('/auth/register',authController.register)
router.post('/auth/login',authController.login)

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

router.get('/comandas',comandaController.index)
router.get('/comandas/pagas',comandaController.showPayed)
router.post('/comandas',comandaController.save)
router.get('/comandas/:id',comandaController.show)
router.put('/comandas/:id',comandaController.update)
router.delete('/comandas/:id',comandaController.delete)

router.get('/pedidos',pedidosController.index)
router.get('/pedidos/search',productController.findByName)
router.get('/pedidos/:id',pedidosController.show)
router.put('/pedidos/:id',pedidosController.update)
router.post('/pedidos',pedidosController.save)
router.delete('/pedidos/:id',pedidosController.delete)

router.get('/produtos',productController.index)
router.post('/produtos',productController.save)
router.get('/produtos/:id',productController.show)
router.put('/produtos/:id', productController.update)
router.delete('/produtos/:id',productController.delete)

router.get('/pedidosProdutos',pedidosProdutosController.index)
router.post('/pedidosProdutos', pedidosProdutosController.save);
router.delete('/pedidosProdutos/:id',pedidosProdutosController.delete)

router.get('/pagamentos',pagamentoController.index)
router.get('/pagamentos/total',pagamentoController.total)
router.post('/pagamentos',pagamentoController.create)
router.get('/pagamentos/:id',pagamentoController.show)
router.put('/pagamentos/:id',pagamentoController.update)
router.delete('/pagamentos/:id',pagamentoController.delete)
export default router
