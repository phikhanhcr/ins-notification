import logger from '@common/logger';
import { DATABASE_URI, LOG_LEVEL } from '@config/environment';
import { DataSource } from 'typeorm';

/**
 * Singleton Database client
 */

// const ds = new DataSource({
//     type: 'postgres',
//     url: DATABASE_URI,
//     synchronize: false,
//     logging: LOG_LEVEL === 'debug',
//     entities: [__dirname + '/../**/entity/*.ts', __dirname + '/../**/entity/*.js'],
//     migrations: [__dirname + '/../../migrations/*.ts'],
//     migrationsRun: false,
//     logger: 'simple-console',
// });

const ds = new DataSource({
    type: 'postgres',
    url: 'postgresql://admin:adminpass@localhost:5433/notification?schema=public',
    synchronize: false,
    logging: true,
    entities: [__dirname + '/../**/entity/*.ts', __dirname + '/../**/entity/*.js'],
    // migrations: [__dirname + '/../../migrations/*.ts'],
    migrationsRun: false,
    logger: 'simple-console',
    port: 5433,
    host: 'test',
    username: 'admin',
    password: 'adminpass',
});

export class DatabaseAdapter {
    private static _connection: DataSource;

    static async getClient(): Promise<DataSource> {
        if (!DatabaseAdapter._connection) {
            await DatabaseAdapter.connect();
        }
        return DatabaseAdapter._connection;
    }

    static async connect(): Promise<void> {
        try {
            DatabaseAdapter._connection = await ds.initialize();
            logger.info('Connect to postgresql successfully!');
        } catch (error) {
            logger.error('Connect to postgresql failed!', error);
            // Exit process with failure
            process.exit(1);
        }
    }
    static async disconnect(): Promise<void> {
        try {
            await DatabaseAdapter._connection.destroy();
            logger.info('Disconnect from postgresql successfully!');
        } catch (error) {
            logger.error('Disconnect from postgresql failed!', error);
        }
    }
}
