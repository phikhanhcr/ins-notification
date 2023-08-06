import logger from '@common/logger';
import { Application } from '@consumer/application';

/**
 * Entrypoint for bootstrapping and starting the application.
 * Might configure aspects like logging, telemetry, memory leak observation or even orchestration before.
 * This is about to come later!
 */

Application.createApplication().then(() => {
    logger.info('The consumer was started successfully!');
});
