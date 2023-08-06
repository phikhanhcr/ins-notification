import { KafkaMessage } from 'kafkajs';
import { EventData } from '@common/event-source/EventData';
import logger from '@common/logger';
import { NotificationService } from '@common/notification/notification.service';
import { get } from 'lodash';
import { NotificationType } from '@common/notification/notification.interface';

import { UserType } from '@common/auth/auth.interface';
import { EventName, TopicName } from '@common/event-source/event-source.topic';

export class PostLikedHandler {
    static getName(): string {
        return 'PostLikedHandler';
    }
    static getTopic(): string {
        return TopicName.POST;
    }
    static getEvents(): string[] {
        return [EventName.POST__LIKED, EventName.POST__UN_LIKED];
    }
    static match(topic: string, message: KafkaMessage): boolean {
        if (topic !== PostLikedHandler.getTopic()) {
            return false;
        }
        const headers = message.headers;
        if (!headers || !headers.event) {
            return false;
        }
        return PostLikedHandler.getEvents().includes(headers.event.toString());
    }

    static async process(
        topic: string,
        partition: number,
        message: KafkaMessage,
        parsedMessage: EventData,
    ): Promise<void> {
        logger.debug('Processing message', { parsedMessage });
        const userId = get(parsedMessage.di_obj, 'data.user_id', 0);
        if (!userId) {
            logger.error('Missing user_id', { parsedMessage });
            return;
        }

        await NotificationService.createNotification(userId, NotificationType.POST_LIKED, parsedMessage);
        return;
    }
}
