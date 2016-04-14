"use strict";
import {Sequelize} from "sequelize";
import {Models} from "./Models";
import {DataTypes} from "sequelize";

module.exports = function(sequelize: Sequelize, DataTypes: DataTypes) {
    return sequelize.define("User", {
        password: { type: DataTypes.STRING, allowNull: false },
        userName: { type: DataTypes.STRING, allowNull: false },
        uuid: { type: DataTypes.UUIDV4, unique: true, primaryKey: true, defaultValue: DataTypes.UUIDV4 }
    }, {
        classMethods: {
            associate(models: Models) {
                models.User.hasMany(models.Song);
            }
        }
    });
};
