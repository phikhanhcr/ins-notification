import { KafkaAdapter } from '@common/infrastructure/kafka.adapter';
import { Router } from './router';

/**
 * Abstraction around bull processor
 */
export class ConsumerServer {
    static async setup(): Promise<void> {
        await Router.register();
        await Router.onMessage();
    }

    static async kill(): Promise<void> {
        await (await KafkaAdapter.getConsumer()).stop();
    }
}
