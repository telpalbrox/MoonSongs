"use strict";
import {Sequelize} from "sequelize";
import {Models} from "./Models";
import {DataTypes} from "sequelize";

module.exports = function(sequelize: Sequelize, DataTypes: DataTypes) {
    return sequelize.define("Song", {
        uuid: { type: DataTypes.UUIDV4, unique: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        album: { type: DataTypes.STRING, allowNull: false },
        artist: { type: DataTypes.STRING, allowNull: false },
        relativePath: { type: DataTypes.STRING, allowNull: false }
    }, {
        classMethods: {
            associate(models: Models) {
                models.Song.belongsTo(models.User);
            }
        }
    });
};
