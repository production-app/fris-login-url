'use strict';
module.exports = {
  async up(queryInterface, Sequelize, DataTypes) {
    await queryInterface.createTable('mailLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      
      },
      uuid: {
        type: Sequelize.UUID, 
        defaultValue: Sequelize.UUIDV4

      },
      sender_email: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
      isOpen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isShown: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      subject: {
        type: Sequelize.STRING
      },
      sender_name: {
        type: Sequelize.STRING
      },
      assignees: {
        type: Sequelize.STRING
      },
      attachment: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.ENUM('OPENED', 'PENDING', 'IN-PROGRESS', 'COMPLETED'), 
        defaultValue: 'OPENED'
      },
      received_date: {
        type: Sequelize.DATE
      },
      assignees_email: Sequelize.STRING,
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
    await queryInterface.dropTable('mailLogs');
  }
};