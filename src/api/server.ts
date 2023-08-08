import routes from '@api/router';
import logger from '@common/logger';
import { NODE_ENV } from '@config/environment';
import { ResponseMiddleware } from '@api/response.middleware';
import fastify, { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import Joi from 'joi';
import { RequestSource } from '@common/request.interface';
import { getClientIp } from '@supercharge/request-ip';
import fastifyEtag from '@fastify/etag';
import fastifyRawBody from 'fastify-raw-body';
import i18n from '@common/i18n';
import i18nMiddleware from 'i18next-http-middleware';
import cors from '@fastify/cors';
/**
 * Abstraction around the raw FastifyInstance.js server and Nodes' HTTP server.
 * Defines HTTP request mappings, basic as well as request-mapping-specific
 * middleware chains for application logic, config and everything else.
 */
export class FastifyServer {
    private server?: FastifyInstance;

    public async setup(port: number): Promise<FastifyInstance> {
        const server = fastify({ logger: false });
        await this.i18next(server);
        await this.setupStandardMiddlewares(server);
        await this.setupSecurityMiddlewares(server);
        this.setupErrorHandlers(server);
        await this.configureRoutes(server);
        await this.testHook(server);
        this.server = await this.listen(server, port);
        this.server = server;
        return this.server;
    }

    public async listen(server: FastifyInstance, port: number): Promise<FastifyInstance> {
        logger.info(`Starting server on port ${port} (${NODE_ENV})`);
        await server.listen({ host: '0.0.0.0', port });
        return server;
    }

    public async testHook(server: FastifyInstance): Promise<void> {
        server.addHook('onRequest', (request, reply, done) => {
            // Some code
            // console.log({ request, reply, payload });
            // console.log('123123');
            // done();
            console.log('oonRequest');
            done();
        });
        server.addHook('preParsing', (request, reply, payload, done) => {
            // Some code
            // console.log({ request, reply, payload });
            // console.log('123123');
            // done();
            console.log('preParsing');
            done();
        });
        server.addHook('onTimeout', async (request, reply) => {
            // Some code
            console.log('timout');
            // await asyncMethod();
        });
    }

    public async kill(): Promise<void> {
        if (this.server) {
            await this.server.close();
        }
    }

    private async setupSecurityMiddlewares(server: FastifyInstance) {
        await server.register(fastifyHelmet, {
            referrerPolicy: { policy: 'same-origin' },
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'unsafe-inline'"],
                    scriptSrc: ["'unsafe-inline'", "'self'"],
                },
            },
        });
        server.register(cors, { origin: '*' });
    }

    private async setupStandardMiddlewares(server: FastifyInstance) {
        // To be added
        await server.register(fastifyRawBody, {
            field: 'rawBody', // change the default request.rawBody property name
            global: false, // add the rawBody to every request. **Default true**
            encoding: 'utf8', // set it to false to set rawBody as a Buffer **Default utf8**
            runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
            routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
        });
        server.decorateReply('sendJson', (data: object) => {
            return { error: 0, message: 'OK', ...data };
        });
        server.setValidatorCompiler(({ schema, method, url, httpPart }) => {
            return (data) => (schema as Joi.AnySchema).validate(data, { convert: true });
        });
        server.decorateRequest('getRequestInfo', function () {
            return {
                source: RequestSource.API,
                ip: getClientIp(this),
                ua: this.headers['user-agent'],
                country: this.headers['cf-ipcountry'],
            };
        });
        server.addHook('onRequest', async (request, reply) => {
            // request.locals = {};
        });
        await server.register(fastifyEtag, { weak: true });
    }

    private async configureRoutes(server: FastifyInstance) {
        await server.register(routes);
    }

    private setupErrorHandlers(server: FastifyInstance) {
        // if error is not an instanceOf APIError, convert it.
        server.setErrorHandler(ResponseMiddleware.error);

        // catch 404 and forward to error handler
        server.setNotFoundHandler(ResponseMiddleware.notFound);
    }

    private async i18next(server: FastifyInstance) {
        const i18 = await i18n.getI18n();
        server.addHook('onRequest', (req, rep, done) => i18nMiddleware.handle(i18)(req as any, rep as any, done));
    }
}
