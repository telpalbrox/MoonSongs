import fs = require('fs');
import path = require('path');
import Sequelize = require('sequelize');
import {Models} from "./Models";
const env = process.env.NODE_ENV || "development";
const config = require('../../../../config/config')[env];
const sequelize: Sequelize.Sequelize = new Sequelize(config.database, config.username, config.password, config);
let db: Database = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (!/\.ts$/.test(file)) && (file !== "index.js") && (file !== "Models.js");
    })
    .forEach(function(file) {
        var model: any = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

export default db;

export interface Database extends Models {
    sequelize?: Sequelize.Sequelize
}
