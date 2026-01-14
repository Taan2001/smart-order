// libs
import "dotenv/config";
import express, { Application } from "express";
import http from "http";

// routes
import routes from "./routes";

// middlewares
import errorHandleMiddleware from "./middlewares/error-handler.middlerware";
import databaseConnectionHandler from "./database/db";

// create express app
const app: Application = express();

// set port, default is 3000
const port: number = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

// parse request of Content-Type: application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounted all routes
app.use("/api/v1", routes);

// error handling middleware
app.use(errorHandleMiddleware);

// create server
const server = http.createServer(app);

// start server
server.listen(port, async () => {
    // test database connection on server start
    await databaseConnectionHandler();

    console.log(`Server is running at http://localhost:${port}`);
});
