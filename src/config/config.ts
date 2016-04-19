module.exports = {
    development: {
        dialect: "sqlite",
        storage: "./db.development.sqlite",
        music: "../music"
    },
    test: {
        dialect: "sqlite",
        storage: "./db.test.sqlite",
        music: "../music"
    }
};
