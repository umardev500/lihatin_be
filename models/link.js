'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    static associate(models) {
      Link.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      })
    }
  }
  Link.init({
    user_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    encodeurl : DataTypes.STRING,
    short: DataTypes.STRING,
    views: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Link',
  });
  return Link;
};