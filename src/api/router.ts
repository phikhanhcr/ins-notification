import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import testRoutes from '@api/test/test.route';
import notification from '@api/notification/notification.route';

const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/status', (req: FastifyRequest, res: FastifyReply) => {
        res.send('OK');
    });
    fastify.register(testRoutes, { prefix: '/local' });
    fastify.register(notification, { prefix: '/api/notifications' });
};

export default router;
