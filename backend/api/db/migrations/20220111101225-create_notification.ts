'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_notifications_deliveryStatus" CASCADE;'
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_notifications_delieveryStatus" CASCADE;'
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_notifications_type" CASCADE;'
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_notifications_notification_medium" CASCADE;'
      );
      await queryInterface.createTable('notifications', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        type: {
          type: Sequelize.ENUM,
          values: [
            'EV_UPCOMING_REMINDER',
            'EV_DAILY_REMINDER',
            'EV_CREATE',
            'EV_BOOKED',
            'EV_CANCELLED',
          ],
          defaultValue: null,
        },
        subject: { type: Sequelize.STRING },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          unique: false,
          references: { model: { tableName: 'users' }, key: 'id' },
        }, //toUserId from the users table
        toNumber: { type: Sequelize.STRING },
        toEmail: { type: Sequelize.STRING },
        notification_medium: {
          type: Sequelize.ENUM,
          values: ['SMS', 'EMAIL'],
          defaultValue: null,
        },
        eventIds: Sequelize.ARRAY({
          type: Sequelize.INTEGER,
          allowNull: true,
          unique: false,
          references: { model: { tableName: 'events' }, key: 'id' },
        }),
        userType: { type: Sequelize.STRING, allowNull: false },
        serviceId: { type: Sequelize.STRING }, //This will store the reference id  when we send the sms/email
        message: { type: Sequelize.STRING },
        delieveryStatus: {
          type: Sequelize.ENUM,
          values: ['I', 'S', 'F'], //I - Initiated,S- Sent, F- Failed
          defaultValue: 'I',
        },
        createdAt: { type: Sequelize.DATE(3), defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE(3), defaultValue: null },
      });
    } catch (error) {
      console.log('Failed migration script:\n\n', error, '\n\n');
      throw error;
    }
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('notifications');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_notifications_delieveryStatus" CASCADE;'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_notifications_deliveryStatus" CASCADE;'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_notifications_type" CASCADE;'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_notifications_notification_medium" CASCADE;'
    );
  },
};
