import './config/load-env.js';
import express from "express";
import { sequelize } from "./database/index.js";
import { adminJs, adminJsRouter } from './adminjs/index.js';
import router from "./routes.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { adminFrontendMiddleware } from './middlewares/adminAuth.js';

const app = express();

// === CORS (tem que vir primeiro!) ===
const allowedOrigins = [
  "http://localhost:3000",
  "https://esadev.com.br",
  "https://www.esadev.com.br",
];

app.use(cors({
  origin: (origin, callback) => {
    // requisições sem origin (SSR, server-to-server, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // NÃO lança erro → só bloqueia o browser
    return callback(null, false);
  },
  credentials: true,
}));

// === Middlewares básicos ===
app.use(express.json());
app.use(cookieParser());

// === Static files e AdminJS ===
app.use(express.static('public'));
app.use(adminJs.options.rootPath,adminFrontendMiddleware, adminJsRouter);


// === Rotas da API ===
app.use(router);

// === Servidor ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected successfully");
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ Erro ao conectar ao DB:", err);
  }
});
