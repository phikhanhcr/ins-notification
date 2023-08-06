import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { TestController } from './test.controller';

const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/common', TestController.common);
};

export default router;
