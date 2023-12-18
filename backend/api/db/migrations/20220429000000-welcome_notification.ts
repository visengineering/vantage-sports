import { QueryInterface, Sequelize } from 'sequelize/types';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_notifications_type" ADD VALUE 'WELCOME_USER' after 'EV_REVIEW';`
    );
  },
  down: async (queryInterface: any, Sequelize: any) => {
    // Below would cause:
    // ERROR: permission denied for table pg_enum
    // but its no harm in leaving old enum value.
    // We have also already created similar migration:
    // backend/api/db/migrations/20220209123634-update_fields_on_notification.ts
    // try {
    //   const query =
    //     'DELETE FROM pg_enum ' +
    //     "WHERE enumlabel = 'WELCOME_USER' " +
    //     "AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = 'enum_notifications_type')";
    //   return queryInterface.sequelize.query(query);
    // } catch (error) {
    //   console.log('Failed migration down() script:\n\n', error, '\n\n');
    //   throw error;
    // }
  },
};
