import logger = require('winston');

const loggerConfig = {
    debug: {
        console: {
            level: 'debug',
            handleExceptions: true,
            name: "console.debug",
            json: false,
            colorize: true,
            silent: (process.env.NODE_ENV == "test")
        }
    }
};

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, loggerConfig.debug.console);
