if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import cron from 'node-cron';
import schedulerService from '../services/scheduler.service';
import logger from '../helpers/logger';

const dailyNotificationTime =
  process.env.DAILY_NOTIFICATION_TIME || `0 14 * * *`;

const scheduleConfig = {
  scheduled: true,
  timezone: 'GMT',
};

const {
  notificationBefore1Hour,
  notificationEveryday9AM,
  reviewNotificationHourly,
} = schedulerService();

const startScheduler = () => {
  logger.info('Scheduler service started from clock js file');
  cron.schedule(dailyNotificationTime, notificationEveryday9AM, scheduleConfig);
  cron.schedule('*/15 * * * *', notificationBefore1Hour, scheduleConfig);
  cron.schedule('*/15 * * * *', reviewNotificationHourly, scheduleConfig);
};

startScheduler();
