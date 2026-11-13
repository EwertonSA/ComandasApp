import 'dotenv/config'
import { bundle } from '@adminjs/bundler'
import path from 'path'
import '../dist/src/adminjs/resources/index.js'
import {componentLoader} from '../dist/src/adminjs/resources/dashboard.js';
// 🧠 Este import deve carregar e executar o componentLoader
// Isso garante que os componentes estejam registrados antes de gerar o bundle


// ⚙️ Executa o bundle
const run = async () => {
  
  await bundle({
    componentLoader,
    destinationDir:'public/admin/frontend/assets' // caminho padrão usado pelo AdminJS
  })
  console.log('✅ Bundle gerado com sucesso.')
}
run().catch(console.error)