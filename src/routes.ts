import express from 'express'
import { mesasController } from './controllers/mesasController.js'
import { clientesController } from './controllers/clienteController.js'
import { pedidosController } from './controllers/pedidosController.js'
import { comandaController } from './controllers/comandaController.js'
import { productController } from './controllers/productController.js'
import { pedidosProdutosController } from './controllers/pedidosProdutosController.js'
import { pagamentoController } from './controllers/pagamentoController.js'
import { authController } from './controllers/authController.js'
import ensureAuth from './middlewares/auth.js'


const router= express.Router()
router.post('/api/auth/register',authController.register)
router.post('/api/auth/login',authController.login)
router.post("/api/auth/autoLogin",authController.autoLogin)

router.get('/api/mesas',mesasController.index)
router.post('/api/mesas',mesasController.save)
router.put('/api/mesas/:id',mesasController.update)
router.get('/api/mesas/:id',mesasController.show)
router.delete('/api/mesas/:id',mesasController.delete)

router.get('/api/clientes',ensureAuth,clientesController.index1)
router.get('/api/clienteCompleto',ensureAuth,clientesController.index)
router.post('/api/clientes',ensureAuth,clientesController.registro)
router.put('/api/clientes/:id',ensureAuth,clientesController.update)
router.get('/api/clientes/:id',ensureAuth,clientesController.show)
router.delete('/api/clientes/:id/:mesaId',ensureAuth,clientesController.delete)

router.get('/api/comandas',ensureAuth,comandaController.index)
router.get('/api/comandas/pagas',ensureAuth,comandaController.showPayed)
router.post('/api/comandas',ensureAuth,comandaController.save)
router.get('/api/comandas/:id',ensureAuth,comandaController.show)
router.put('/api/comandas/:id',ensureAuth,comandaController.update)
router.delete('/api/comandas/:id',ensureAuth,comandaController.delete)

router.get('/api/pedidos',ensureAuth,pedidosController.index2)
router.get('/api/pedidoCompleto',ensureAuth,pedidosController.index)
router.get('/api/pedidos/search',ensureAuth,productController.findByName)
router.get('/api/pedidos/:id',ensureAuth,pedidosController.show)
router.put('/api/pedidos/:id',ensureAuth,pedidosController.update)
router.post('/api/pedidos',ensureAuth,pedidosController.save)
router.delete('/api/pedidos/:id',ensureAuth,pedidosController.delete)

router.get('/api/produtos',ensureAuth,productController.index)
router.post('/api/produtos',ensureAuth,productController.save)
router.get('/api/produtos/categoria/:categoria',ensureAuth,productController.getAllGroupedByCategory)
router.get('/api/produtos/:id',ensureAuth,productController.getById)



router.put('/api/produtos/:id',ensureAuth, productController.update)
router.delete('/api/produtos/:id',ensureAuth,productController.delete)

router.get('/api/pedidosProdutos',ensureAuth,pedidosProdutosController.index)
router.post('/api/pedidosProdutos',ensureAuth, pedidosProdutosController.save);
router.delete('/api/pedidosProdutos/:id',ensureAuth,pedidosProdutosController.delete)

router.get('/api/pagamentos',ensureAuth,pagamentoController.index)
router.get('/api/pagamentos/total',ensureAuth,pagamentoController.total)
router.post('/api/pagamentos',ensureAuth,pagamentoController.create)
router.get('/api/pagamentos/:id',ensureAuth,pagamentoController.show)
router.put('/api/pagamentos/:id',ensureAuth,pagamentoController.update)
router.delete('/api/pagamentos/:id',ensureAuth,pagamentoController.delete)
export default router
