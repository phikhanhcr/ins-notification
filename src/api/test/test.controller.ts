import { UserType } from '@common/auth/auth.interface';
import { EventData, EventObjectType } from '@common/event-source/EventData';
import { MqttService } from '@common/mqtt/mqtt.service';
import { NotificationType } from '@common/notification/notification.interface';
import { NotificationService } from '@common/notification/notification.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { get } from 'lodash';
export class TestController {
    static async common(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const data = await NotificationService.getUserNotifications({ id: 1, name: 'asad' });
            // console.log('body ', req.body);
            // console.log('query ', req.query);
            // console.log('params ', req.params);
            // console.log('headers ', req.headers);
            // console.log('raw ', req.raw);
            // console.log('server ', req.server);
            // console.log('id ', req.id);
            // console.log('ip ', req.ip);
            // console.log('ips ', req.ips);
            // console.log('hostname ', req.hostname);
            // console.log('protocol ', req.protocol);
            // console.log('url ', req.url);
            // console.log('routerMethod ', req.routerMethod);
            // console.log('routeOptions ', req.routeOptions.bodyLimit);
            // console.log('routeOptions ', req.routeOptions.method);
            // console.log('routeOptions ', req.routeOptions.url);
            // console.log('routeOptions ', req.routeOptions.attachValidation);
            // console.log('routeOptions ', req.routeOptions.logLevel);
            // console.log('routeOptions ', req.routeOptions.version);
            // console.log('routeOptions ', req.routeOptions.exposeHeadRoute);
            // console.log('routeOptions ', req.routeOptions.prefixTrailingSlash);
            // console.log('routerPath ', req.routerPath);
            // req.log.info('some info');
            return res.send({
                message: 'Operation executed successfully!',
                data: data.map((notification) => notification.transform()),
            });
        } catch (error) {
            throw error;
        }
    }
}
