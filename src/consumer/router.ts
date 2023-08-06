import { EventData } from '@common/event-source/EventData';
import { KafkaAdapter } from '@common/infrastructure/kafka.adapter';
import logger from '@common/logger';
import { MessageHandler } from './interface';
import { PostLikedHandler } from './post/postLikedHandler';

const handlers: MessageHandler[] = [];
const topics: Map<string, Set<string>> = new Map();

export class Router {
    static async register(): Promise<void> {
        handlers.push(PostLikedHandler);

        handlers.forEach((handler) => {
            if (!topics.has(handler.getTopic())) {
                topics.set(handler.getTopic(), new Set());
            }
            handler.getEvents().forEach((event) => topics.get(handler.getTopic()).add(event));
        });

        const consumer = await KafkaAdapter.getConsumer();
        await Promise.all(
            Array.from(topics.keys()).map(async (topic) => {
                await consumer.subscribe({ topic });
            }),
        );
    }

    static async onMessage(): Promise<void> {
        return (await KafkaAdapter.getConsumer()).run({
            partitionsConsumedConcurrently: 4,
            autoCommitThreshold: 100,
            autoCommitInterval: 5000,
            eachMessage: async ({ topic, partition, message }) => {
                logger.debug('Receive kafka message', {
                    stringData: JSON.stringify({
                        topic,
                        partition,
                        data: message.value.toString(),
                        key: message.key.toString(),
                        offset: message.offset,
                    }),
                });

                if (
                    message.headers &&
                    message.headers.event &&
                    topics.has(topic) &&
                    topics.get(topic).has(message.headers.event.toString())
                ) {
                    // store message
                    let parsedMessage: EventData;
                    try {
                        parsedMessage = EventData.newFrom(JSON.parse(message.value.toString()));
                        // await EventLogService.createEventLog(parsedMessage);
                    } catch (error) {
                        logger.error('Store message error', { error, message: message.value.toString() });
                        return;
                    }

                    await Promise.all(
                        handlers.map(async (handler) => {
                            try {
                                if (handler.match(topic, message)) {
                                    await handler.process(topic, partition, message, parsedMessage);
                                }
                            } catch (error) {
                                logger.error('Error when process event', { error, handlerName: handler.getName() });
                            }
                        }),
                    );
                }
            },
        });
    }
}
