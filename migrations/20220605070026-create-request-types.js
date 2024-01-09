'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requestTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      request_id: {
          type: Sequelize.UUID, 
          defaultValue: Sequelize.UUIDV4
      },
      request_types: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM( 'OPENED', 'PENDING', 'IN-PROGRESS', 'COMPLETED'),
        defaultValue: 'OPENED'
      },
      ticket_id: {
        type: Sequelize.INTEGER
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requestTypes');
  }
};