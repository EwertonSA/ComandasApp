import './config/load-env.js';
import express from "express";
import { sequelize } from "./database/index.js";
import { adminJs, adminJsRouter } from './adminjs/index.js';
import router from "./routes.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { JWT_KEY } from './config/environment.js';

const app = express();

// === Middlewares básicos ===
app.use(express.json());
app.use(cookieParser());

// === CORS ===
const allowedOrigins = [
  "http://localhost:3000",
  "https://esadev.com.br",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman ou SSR
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Origin não permitido pelo CORS"));
  },
  credentials: true, // necessário para enviar cookies HttpOnly
}));

// === Static files e AdminJS ===
app.use(express.static('public'));
app.use(adminJs.options.rootPath, adminJsRouter);

// === Rotas da API ===
app.use(router);

// === Servidor ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully");
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("Erro ao conectar ao DB:", err);
  }
});
