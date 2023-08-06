import { DatabaseAdapter } from '@common/infrastructure/database.adapter';
import { KafkaAdapter } from '@common/infrastructure/kafka.adapter';
import { MQTTAdapter } from '@common/mqtt/MQTTAdapter';
import { ConsumerServer } from './server';
import logger from '@common/logger';

export class Application {
    static async createApplication(): Promise<void> {
        await DatabaseAdapter.connect();
        await KafkaAdapter.getConsumer();
        await MQTTAdapter.getClient();

        await ConsumerServer.setup();

        Application.registerEvents();

        Application.handleExit();
    }

    static registerEvents(): void {
        // do something
    }
    private static handleExit() {
        process.on('uncaughtException', (err: unknown) => {
            logger.error('Uncaught exception', err);
            Application.shutdownProperly(1);
        });
        process.on('unhandledRejection', (reason: unknown | null | undefined) => {
            logger.error('Unhandled Rejection at promise', reason);
            Application.shutdownProperly(2);
        });
        process.on('SIGINT', () => {
            logger.info('Caught SIGINT, exitting!');
            Application.shutdownProperly(128 + 2);
        });
        process.on('SIGTERM', () => {
            logger.info('Caught SIGTERM, exitting');
            Application.shutdownProperly(128 + 2);
        });
        process.on('exit', () => {
            logger.info('Exiting process...');
        });
    }

    private static shutdownProperly(exitCode: number) {
        Promise.resolve()
            .then(() => ConsumerServer.kill())
            .then(() => KafkaAdapter.disconnect())
            .then(() => DatabaseAdapter.disconnect())
            .then(() => {
                logger.info('Shutdown complete, bye bye!');
                process.exit(exitCode);
            })
            .catch((err) => {
                logger.error('Error during shutdown', err);
                process.exit(1);
            });
    }
}
