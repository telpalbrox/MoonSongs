"use strict";
import {Sequelize} from "sequelize";
import {Models} from "./Models";
import {DataTypes} from "sequelize";

module.exports = function(sequelize: Sequelize, DataTypes: DataTypes) {
    return sequelize.define("Song", {
        uuid: { type: DataTypes.UUIDV4, unique: true, defaultValue: DataTypes.UUIDV4 },
        title: { type: DataTypes.STRING, allowNull: false, primaryKey: true }
    }, {
        classMethods: {
            associate(models: Models) {
                models.Song.belongsTo(models.User);
            }
        }
    });
};
