import logger from '../helpers/logger';
import { CreationAttributes } from 'sequelize';
import { NotificationDeliveryStatus } from '../../api/models/Notification';
import { Notification } from '../models';

async function createNotificationLog(data: CreationAttributes<Notification>) {
  try {
    let notificationData = await Notification.create(data);
    notificationData = notificationData.toJSON();
    return notificationData;
  } catch (error: any) {
    console.error('Errror', error);
    logger.error(
      'Failed to log the notification to database, data:',
      JSON.stringify(data)
    );
    return false;
  }
}

type NotificationUpdateData = {
  updateBody: {
    serviceId: any;
    deliveryStatus: NotificationDeliveryStatus;
    updatedAt: Date;
  };
  updateWhere: { where: { id: number } };
};
async function updateNotificationLog({
  updateBody,
  updateWhere,
}: NotificationUpdateData) {
  try {
    await Notification.update(updateBody, {
      ...updateWhere,
      individualHooks: true,
    });
  } catch (error: any) {
    logger.error(
      'Error : updateFailedNotification : Failed to send notification logging failed',
      error?.message
    );
    return false;
  }
}
type NotificationFailedData = {
  id: number;
};
async function updateFailedNotificationLog({ id }: NotificationFailedData) {
  try {
    const failureUpdateBody = {
      deliveryStatus: NotificationDeliveryStatus.F,
      updatedAt: new Date(),
    };
    const updateWhere = {
      where: {
        id,
      },
    };
    await Notification.update(failureUpdateBody, updateWhere);
  } catch (error: any) {
    logger.error(
      'Error : updateFailedNotification : Failed to send notification logging failed',
      error?.message
    );
    return false;
  }
}

export {
  createNotificationLog,
  updateNotificationLog,
  updateFailedNotificationLog,
};

export default {
  createNotificationLog,
  updateNotificationLog,
  updateFailedNotificationLog,
};
