import express from 'express'
import { mesasController } from './controllers/mesasController'
import { clientesController } from './controllers/clienteController'
import { pedidosController } from './controllers/pedidosController'
import { comandaController } from './controllers/comandaController'
import { productController } from './controllers/productController'
import { pedidosProdutosController } from './controllers/pedidosProdutosController'
import { pagamentoController } from './controllers/pagamentoController'
import { authController } from './controllers/authController'
import ensureAuth from './middlewares/auth'


const router= express.Router()
router.post('/auth/register',authController.register)
router.post('/auth/login',authController.login)
router.post("/auth/autoLogin",authController.autoLogin)

router.get('/mesas',mesasController.index)
router.post('/mesas',mesasController.save)
router.put('/mesas/:id',mesasController.update)
router.get('/mesas/:id',mesasController.show)
router.delete('/mesas/:id',mesasController.delete)

router.get('/clientes',ensureAuth,clientesController.index)
router.post('/clientes',ensureAuth,clientesController.registro)
router.put('/clientes/:id',ensureAuth,clientesController.update)
router.get('/clientes/:id',ensureAuth,clientesController.show)
router.delete('/clientes/:id/:mesaId',ensureAuth,clientesController.delete)

router.get('/comandas',ensureAuth,comandaController.index)
router.get('/comandas/pagas',ensureAuth,comandaController.showPayed)
router.post('/comandas',ensureAuth,comandaController.save)
router.get('/comandas/:id',ensureAuth,comandaController.show)
router.put('/comandas/:id',ensureAuth,comandaController.update)
router.delete('/comandas/:id',ensureAuth,comandaController.delete)

router.get('/pedidos',ensureAuth,pedidosController.index2)
router.get('/pedidoCompleto',ensureAuth,pedidosController.index)
router.get('/pedidos/search',ensureAuth,productController.findByName)
router.get('/pedidos/:id',ensureAuth,pedidosController.show)
router.put('/pedidos/:id',ensureAuth,pedidosController.update)
router.post('/pedidos',ensureAuth,pedidosController.save)
router.delete('/pedidos/:id',ensureAuth,pedidosController.delete)

router.get('/produtos',ensureAuth,productController.index)
router.post('/produtos',ensureAuth,productController.save)
router.get('/produtos/categoria/:categoria',ensureAuth,productController.getAllGroupedByCategory)
router.get('/produtos/:id',ensureAuth,productController.getById)



router.put('/produtos/:id',ensureAuth, productController.update)
router.delete('/produtos/:id',ensureAuth,productController.delete)

router.get('/pedidosProdutos',ensureAuth,pedidosProdutosController.index)
router.post('/pedidosProdutos',ensureAuth, pedidosProdutosController.save);
router.delete('/pedidosProdutos/:id',ensureAuth,pedidosProdutosController.delete)

router.get('/pagamentos',ensureAuth,pagamentoController.index)
router.get('/pagamentos/total',ensureAuth,pagamentoController.total)
router.post('/pagamentos',ensureAuth,pagamentoController.create)
router.get('/pagamentos/:id',ensureAuth,pagamentoController.show)
router.put('/pagamentos/:id',ensureAuth,pagamentoController.update)
router.delete('/pagamentos/:id',ensureAuth,pagamentoController.delete)
export default router
