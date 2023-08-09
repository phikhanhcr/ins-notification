import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { NotificationController } from './notification.controller';
import { AuthMiddleware } from '@api/auth/auth.middleware';

const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/', { onRequest: AuthMiddleware.requireAuth }, NotificationController.getUserNotifications);

    fastify.get('/read-all', { onRequest: AuthMiddleware.requireAuth }, NotificationController.readAll);

    fastify.get('/check-new', { onRequest: AuthMiddleware.requireAuth }, NotificationController.checkNew);
};

export default router;
