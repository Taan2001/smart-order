# 🚀 Node Express TypeScript Starter

A backend starter project built with **Node.js + Express + TypeScript + <DATABASE>**.
Node version: **20.19.4**

## 🛠️ Tech Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Nodemon](https://nodemon.io/) + [tsx](https://tsx.is/) (hot reload)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) (code style)
- [esbuild](https://esbuild.github.io/) (build code)
- [winston](https://www.npmjs.com/package/winston) (logger)

## 📂 Project Structure

```
src/
├── @types/express # Environment variable typings
├── controllers/ # Handle request/response logic
├── middlewares/ # Custom Express middlewares
├── models/ # Interfaces / schemas (if any)
├── routes/ # Express route definitions
├── services/ # Business logic layer
├── utils/ Utility/helper functions
├── server.ts # Express config + Entry point
├ .env # Environment variables
├ .env.development # Environment variables
├ .env.test # Environment variables
├ .env.production # Environment variables
├ .gitattributes # git contributes
├ .gitignore
├ .prettierignore # Prettier ignore rules
├ .prettierrc.js # Prettier configuration
├ build.js # Esbuild configuration
├ eslint.config.js # Eslint configuration
├ nodemon.json # Nodemon configuration
├ package.json
├ README.md
├ tsconfig.json
```

## 📦 Installation

```bash
npm install
```

## Required files

```bash
.env.development
.env.test
.env.production
```

## 🔧 Scripts

### Development (hot reload)

```bash
npm run dev
```

### Check code with Prettier

```bash
npm run prettier
```

### Format code with Prettier

```bash
npm run prettier:fix
```

### Check Eslint

```bash
npm run lint
```

### Format code with Eslint

```bash
npm run lint:fix
```

### Build source with esbuild

```bash
npm run build
```

### Start server (production)

```bash
npm start
```
