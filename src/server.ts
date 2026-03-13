import './config/load-env.js';
import express from "express";
import { sequelize } from "./database/index.js";
import { adminJs, adminJsRouter } from './adminjs/index.js';
import router from "./routes.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { adminFrontendMiddleware } from './middlewares/adminAuth.js';

const app = express();

// === CORS ===
const allowedOrigins = [
  "http://localhost:3000",
  "https://esadev.com.br",
  "https://www.esadev.com.br"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // server-side request
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(adminJs.options.rootPath, adminFrontendMiddleware, adminJsRouter);
app.use(router);

// === Conexão com retry ===
async function startServer(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Conectado ao PostgreSQL com sucesso!");
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
      return;
    } catch (err:any) {
      console.error(`❌ Falha ao conectar (tentativa ${i + 1}):`, err.message);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else process.exit(1); // força PM2 a reiniciar só depois de várias tentativas
    }
  }
}

startServer();
