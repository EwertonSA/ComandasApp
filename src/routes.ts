import express from 'express'
import { mesasController } from './controllers/mesasController.js'
import { clientesController } from './controllers/clienteController.js'
import { pedidosController } from './controllers/pedidosController.js'
import { comandaController } from './controllers/comandaController.js'
import { productController } from './controllers/productController.js'
import { pedidosProdutosController } from './controllers/pedidosProdutosController.js'
import { pagamentoController } from './controllers/pagamentoController.js'
import { authController } from './controllers/authController.js'



import { OauthController } from './controllers/OauthController.js'
import ensureAuth from './middlewares/auth.js'

import { authMiddleware } from './middlewares/auth2.js'
import { IngredientsController } from './controllers/ingredientController.js'
import { ProductIngredientsController } from './controllers/productIngredientsController.js'
import { PedidosProdutosIngredientsController } from './controllers/pedidosProdutosIngredientsController.js'



const router= express.Router()
router.post('/api/auth/register',authController.register)

router.put('/api/updatepassword',authMiddleware,authController.updatePassword)
router.post('/api/forgotpassword',authController.forgotPassword)
router.post('/api/auth/login',authController.loginTest)
router.post('/api/auth/verify',authController.verify2FA)
router.post('/api/auth/reset2fa',authController.reset2fa)
router.post("/api/auth/autoLogin",authController.autoLogin)
router.post('/api/auth/logout',authController.logout)
router.get('/api/auth/verifystate/:comandaId',authController.verifyState)

router.get('/api/auth/facebook/redirect',OauthController.faceBookRedirect)
router.get('/api/auth/facebook/callback',OauthController.facebookCallback)

router.get('/api/auth/linkedin/redirect/',OauthController.linkedInRedirect)
router.get('/api/auth/linkedin/callback/',OauthController.linkedInCallback)
router.get('/api/auth/google/callback',OauthController.googlecallback)
router.get('/api/auth/google',OauthController.googleredirect)
router.get("/api/auth/verify-2fa/setup",OauthController.googleVerify2fa)

router.get('/api/mesas',mesasController.index)
router.post('/api/mesas',mesasController.save)
router.put('/api/mesas/:id',mesasController.update)
router.get('/api/mesas/:id',mesasController.show)
router.delete('/api/mesas/:id',mesasController.delete)

router.get('/api/clientes',ensureAuth,clientesController.index1)
router.get('/api/clienteCompleto',ensureAuth,clientesController.index)
router.post('/api/clientes',authMiddleware,clientesController.registro)
router.post('/api/cliente',ensureAuth,clientesController.register)
router.get('/api/users',ensureAuth,clientesController.showUser)
router.put('/api/clientes/:id',ensureAuth,clientesController.update)
router.get('/api/clientes/:id',ensureAuth,clientesController.show)

router.delete('/api/clientes/:id/:mesaId',ensureAuth,clientesController.delete)

router.get('/api/comandas',ensureAuth,comandaController.index)
router.get('/api/comandas/pagas',ensureAuth,comandaController.showPayed)
router.post('/api/clientComanda',ensureAuth,comandaController.registerClientComanda)
router.post('/api/comandas',authMiddleware,comandaController.save)
router.get('/api/comandasCliente',authMiddleware,comandaController.showClient)
router.get('/api/comandas',authMiddleware,comandaController.orders)
router.get('/api/comandas/:id',authMiddleware,comandaController.show)
router.get('/api/comanda',authMiddleware,comandaController.orders)
router.put('/api/comandas/:id',ensureAuth,comandaController.update)
router.delete('/api/comandas/:id',ensureAuth,comandaController.delete)

router.get('/api/pedidos',ensureAuth,pedidosController.index2)
router.get('/api/pedidoCompleto',ensureAuth,pedidosController.index)
router.get('/api/pedidos/search',ensureAuth,productController.findByName)
router.get('/api/pedidos/:id',ensureAuth,pedidosController.show)
router.put('/api/pedidos/:id',ensureAuth,pedidosController.update)
router.post('/api/pedidos',authMiddleware,pedidosController.save)
router.post('/api/pedidosCliente',authMiddleware,pedidosController.saveForClient)
router.delete('/api/pedidos/:id',ensureAuth,pedidosController.delete)

router.get('/api/produtos',ensureAuth,productController.index)
router.post('/api/produtos',ensureAuth,productController.save)
router.get('/api/produtos/categoria/:categoria',authMiddleware,productController.getByCategory)

router.get('/api/produtos/:id',authMiddleware,productController.getById)
router.put('/api/produtos/:id',productController.update)

router.get('/api/ingredients',IngredientsController.index)
router.post('/api/ingredients',IngredientsController.save)
router.get('/api/ingredients/:id',IngredientsController.showById)

router.get('/api/productIngredients',ProductIngredientsController.index)
router.post('/api/productIngredients',ProductIngredientsController.create)


router.put('/api/produtos/:id',ensureAuth, productController.update)
router.delete('/api/produtos/:id',ensureAuth,productController.delete)

router.get('/api/pedidosProdutos',ensureAuth,pedidosProdutosController.index)
router.post('/api/pedidosProdutos',ensureAuth, pedidosProdutosController.save);
router.delete('/api/pedidosProdutos/:id',ensureAuth,pedidosProdutosController.delete)
router.get('/api/pedidosProdutos/:id',pedidosProdutosController.getById)

router.get('/api/pedidosProdutosIngredients',PedidosProdutosIngredientsController.index)
router.post('/api/pedidosProdutosIngredients',PedidosProdutosIngredientsController.addIngredientsToPedidoProduto)
router.get('/api/pedidosProdutosIngredients/:id',PedidosProdutosIngredientsController.showById)

router.get('/api/pagamentos',ensureAuth,pagamentoController.index)
router.get('/api/pagamentos/total',ensureAuth,pagamentoController.total)
router.post('/api/pagamento',authMiddleware,pagamentoController.paymentForClient)
router.post('/api/pagamentos',ensureAuth,pagamentoController.create)
router.get('/api/pagamentos/:id',ensureAuth,pagamentoController.show)
router.put('/api/pagamentos/:id',ensureAuth,pagamentoController.update)
router.delete('/api/pagamentos/:id',ensureAuth,pagamentoController.delete)
export default router
