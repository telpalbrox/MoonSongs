import {Express} from "express";
import express = require('express');
import bodyParser = require("body-parser");
import logger = require('winston');
import routes from './routes';
import { join } from 'path';
const expressWinston = require('express-winston');
const config = {port: process.env.PORT || 3000};

const app: Express = express();

app.use(bodyParser.json({limit: "7mb"}));

app.use(expressWinston.logger({
    winstonInstance: logger,
    skip() {
        return (process.env.NODE_ENV == "test");
    }
}));

const rootRooter = express.Router();

routes(rootRooter);

app.use('/api', rootRooter);

app.use('/public', express.static(join(__dirname, '../../../public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../../../index.html'));
});

if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../../../webpack.dev.config.js');
    const compiler = webpack(config);

    app.use(webpackHotMiddleware(compiler));
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
}

app.listen(config.port, () => {
    logger.info(`Listening on port: ${config.port}`);
});

export { app };
