import { DatabaseAdapter } from './../infrastructure/database.adapter';
import { pick } from 'lodash';
import { IEventData } from '@common/event-source/EventData';
import { Language } from '@config/multilanguage';
import { NotificationType } from './notification.interface';
import { UserNotificationFactory } from './transform/user-factory';
import { NotificationStatus, UserNotification } from './entity/UserNotification';
import { DataSource } from 'typeorm';

export class NotificationService {
    static async createNotification(
        userId: number,
        type: NotificationType,
        data: IEventData,
    ): Promise<UserNotification> {
        // do something here
        const transformer = UserNotificationFactory.make(type, data);

        const key = transformer.getKey();
        const client = await DatabaseAdapter.getClient();
        const oldNotification = await client.getRepository(UserNotification).findOne({
            where: {
                key,
            },
        });
        // const newUserNotification = { authId: userId, type, key } as UserNotification;
        const newUserNotification = new UserNotification();

        newUserNotification.authId = userId;
        newUserNotification.type = type;
        newUserNotification.key = key;
        newUserNotification.createdAt = new Date();

        let notification: UserNotification = oldNotification || newUserNotification;

        notification.lastReceivedAt = oldNotification ? oldNotification.receivedAt : null;
        notification.receivedAt = new Date();
        notification.status = NotificationStatus.UNSEEN_AND_UNREAD;
        notification = transformer.transform(Language.EN, notification);
        notification.updatedAt = new Date();

        await client
            .createQueryBuilder()
            .insert()
            .orUpdate(
                [
                    'status',
                    'received_at',
                    'updated_at',
                    'image',
                    'icon',
                    'url',
                    'title',
                    'content',
                    'data',
                    'meta',
                    'compiled_at',
                    'last_received_at',
                ],
                ['id'],
            )
            .into(UserNotification)
            .values(notification)
            .execute();
        // run query
        return notification;
    }
}
