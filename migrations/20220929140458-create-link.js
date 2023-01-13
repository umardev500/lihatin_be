'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Links', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      short: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Links', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'link_fkey_user_id',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade', //jika data dihapus, maka kolom yang berelasi terhapus
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Links');
  }
};