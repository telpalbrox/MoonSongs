import logger = require('winston');

module.exports = {
    production: {
        dialect: "sqlite",
        storage: "./moon-songs.sqlite",
        music: "../music"
    },
    development: {
        dialect: "sqlite",
        storage: "./db.development.sqlite",
        music: "../music"
    },
    test: {
        dialect: "sqlite",
        storage: "./db.test.sqlite",
        music: "../music",
        logging(log) {
            if (process.env.NODE_ENV != "test") {
                logger.debug(log);
            }
        }
    }
};
