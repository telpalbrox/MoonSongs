import {Express} from "express";
import express = require('express');
import bodyParser = require("body-parser");
import logger = require('winston');
const expressWinston = require('express-winston');
import routes from './routes';
const config = {port: 3000};

const app: Express = express();

app.use(bodyParser.json({limit: "7mb"}));

app.use(expressWinston.logger({
    winstonInstance: logger
}));

routes(app);

app.listen(config.port, () => {
    logger.info(`Listening on port: ${config.port}`);
});

export { app };