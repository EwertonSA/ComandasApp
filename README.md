# ComandasApp

REST API for restaurant management built with Node.js, Express, TypeScript and PostgreSQL.

This project manages restaurant operations such as tables, clients, commands, products, payments, and ingredients, while also exposing an AdminJS dashboard for administration and monitoring.

## Features

- Restaurant management for tables, orders, and payments
- Client and comanda tracking
- Product and ingredient management
- Order composition with product/ingredient relations
- Authentication and authorization with JWT
- 2FA verification support
- OAuth login via Facebook, LinkedIn and Google
- Admin dashboard with AdminJS
- PostgreSQL persistence with Sequelize
- TypeScript-based backend

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize
- AdminJS
- JWT
- bcryptjs
- CORS + cookie-based auth

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── .sequelizerc
├── package.json
├── package-lock.json
├── public/
├── scripts/
├── seeders/
├── src/
│   ├── adminjs/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── helpers/
│   ├── middlewares/
│   ├── models/
│   ├── services/
│   ├── routes.ts
│   ├── server.ts
│   └── ...
├── produtos.sql
├── produtos_corrigido.sql
├── tsconfig.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have installed:

- Node.js 18 or later
- PostgreSQL
- npm

## Installation

1. Clone the repository

```bash
git clone https://github.com/EwertonSA/ComandasApp.git
cd ComandasApp
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then fill in the values:

```env
DATABASE_URL=postgres://username:password@localhost:5432/your_database
ADMINJS_COOKIE_PASSWORD=your-secret-key
JWT_KEY=your-jwt-secret
ALLOWEDS=http://localhost:3000,http://localhost:5173
```

## Database

This project uses Sequelize and PostgreSQL. You can use the migrations already included in `src/database/migrations`.

Run migrations:

```bash
npx sequelize-cli db:migrate
```

If needed, seed the database:

```bash
npx sequelize-cli db:seed:all
```

## Running the App

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Start the compiled app:

```bash
npm start
```

The server starts on port `3001` by default, unless `PORT` is set in the environment.

## Admin Panel

The app includes an AdminJS interface for managing restaurant data. It is served under the admin route configured by the application.

Access the admin UI in the browser (depending on your configuration):

```text
http://localhost:3001/admin
```

## Main API Routes

Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/verify`
- `POST /api/auth/reset2fa`

Tables

- `GET /api/mesas`
- `POST /api/mesas`
- `PUT /api/mesas/:id`
- `DELETE /api/mesas/:id`

Clients

- `GET /api/clientes`
- `POST /api/clientes`
- `GET /api/clientes/:id`
- `PUT /api/clientes/:id`

Commands / Orders

- `GET /api/comandas`
- `POST /api/comandas`
- `GET /api/comandas/:id`
- `PUT /api/comandas/:id`

Products

- `GET /api/produtos`
- `POST /api/produtos`
- `GET /api/produtos/:id`
- `PUT /api/produtos/:id`
- `DELETE /api/produtos/:id`

Ingredients

- `GET /api/ingredients`
- `POST /api/ingredients`
- `GET /api/ingredients/:id`

Payments

- `GET /api/pagamentos`
- `POST /api/pagamentos`
- `GET /api/pagamentos/:id`
- `PUT /api/pagamentos/:id`
- `DELETE /api/pagamentos/:id`

## Notes

- `ALLOWEDS` is used to define the allowed CORS origins.
- The project uses TypeScript ESM (`"type": "module"` in `package.json`).
- Some scripts and generated assets exist under `public/` and `scripts/` for admin UI bundling.

## License

This project is currently marked with the `ISC` license in `package.json`.

## Contributing

Contributions are welcome. If you want to improve the API, add new modules, or improve the admin experience, open a pull request with a clear description of the change.

## Contact

For questions or support, please open an issue in the repository or contact the project maintainer.
