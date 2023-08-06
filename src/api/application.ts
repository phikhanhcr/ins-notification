import { PORT } from '@config/environment';
import { FastifyServer } from '@api/server';
import { DatabaseAdapter } from '@common/infrastructure/database.adapter';
// import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import logger from '@common/logger';
import 'reflect-metadata';
import { MQTTAdapter } from '@common/mqtt/MQTTAdapter';

/**
 * Wrapper around the Node process, FastifyServer abstraction and complex dependencies such as services that FastifyServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are dependencies of FastifyServer.
 */

(BigInt.prototype as any).toJSON = function (): string {
    return this.toString();
};

export class Application {
    /**
     * Implement create application, connecting db here
     */
    public static async createApplication(): Promise<FastifyServer> {
        await DatabaseAdapter.connect();
        // await RedisAdapter.connect();
        await MQTTAdapter.getClient();

        Application.registerEvents();

        const server = new FastifyServer();
        await server.setup(PORT);
        Application.handleExit(server);

        return server;
    }

    /**
     * Register signal handler to graceful shutdown
     *
     * @param server Express server
     */
    private static handleExit(server: FastifyServer) {
        process.on('uncaughtException', (err: unknown) => {
            logger.error('Uncaught exception', err);
            Application.shutdownProperly(1, server);
        });
        process.on('unhandledRejection', (reason: unknown | null | undefined) => {
            logger.error('Unhandled Rejection at promise', reason);
            Application.shutdownProperly(2, server);
        });
        process.on('SIGINT', () => {
            logger.info('Caught SIGINT, exitting!');
            Application.shutdownProperly(128 + 2, server);
        });
        process.on('SIGTERM', () => {
            logger.info('Caught SIGTERM, exitting');
            Application.shutdownProperly(128 + 2, server);
        });
        process.on('exit', () => {
            logger.info('Exiting process...');
        });
    }

    /**
     * Handle graceful shutdown
     *
     * @param exitCode
     * @param server
     */
    private static shutdownProperly(exitCode: number, server: FastifyServer) {
        Promise.resolve()
            .then(() => server.kill())
            // .then(() => RedisAdapter.disconnect())
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

    private static registerEvents() {
        // register event
    }
}
