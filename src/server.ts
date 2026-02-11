import './config/load-env.js';
import express from "express";
import { sequelize, connectDatabase } from "./database/index.js"; // conectando com retry
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
  "https://www.esadev.com.br",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));

// === Middlewares ===
app.use(express.json());
app.use(cookieParser());

// === Static files e AdminJS ===
app.use(express.static('public'));
app.use(adminJs.options.rootPath, adminFrontendMiddleware, adminJsRouter);

// === Rotas da API ===
app.use(router);

// === Inicialização do servidor ===
async function startServer() {
  try {
    await connectDatabase(); // retry automático
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Não foi possível iniciar o servidor:", err);
    process.exit(1); // força PM2 a reiniciar depois
  }
}

startServer();
