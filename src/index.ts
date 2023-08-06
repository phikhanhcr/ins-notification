// import { DatabaseAdapter } from './common/infrastructure/database.adapter';
// import Fastify from 'fastify';
// import 'module-alias/register';
// import 'reflect-metadata';
// import { EventData, EventObjectType } from '@common/event-source/EventData';
// import { UserType } from '@common/auth/auth.interface';
// import { NotificationService } from '@common/notification/notification.service';
// import { NotificationType } from '@common/notification/notification.interface';
// import { get } from 'lodash';
// const fastify = Fastify();

// try {
//     DatabaseAdapter.connect()
//         .then(() => {
//             console.log('Db connected successfully');
//         })
//         .catch((e) => {
//             console.log(e);
//         });
// } catch (error) {
//     // do something
//     console.log({ error });
// }

// fastify.get('/', async (req, reply) => {
//     const eventData = new EventData({
//         event: 'like',
//         topic: 'User',
//         key: `post_id`,
//         subject: {
//             // doi tuong gay ra hanh dong
//             type: UserType.USER,
//             id: `1`,
//             data: {
//                 name: 'Lan Phuong',
//                 avatar: 'this is his/her avatar',
//             },
//         },
//         di_obj: {
//             // doi tuong chiu tac dong cua hanh dong
//             type: EventObjectType.POST,
//             id: '63f20ce68d619df52aaddcd9',
//             data: {
//                 _id: '63f20ce68d619df52aaddcd9',
//                 title: 'ahihi',
//                 image: 'http://localhost:3000',
//             },
//         },

//         // doi tuong phu chiu tac dong
//         pr_obj: {
//             type: EventObjectType.USER,
//             id: `123`,
//             data: {
//                 id: 123,
//                 name: 'Phi Khanh',
//             },
//         },
//         context: {
//             req: {
//                 like_count: 10,
//             },
//         },
//     });
//     const userId = get(eventData.pr_obj, 'data.id', 0);
//     await NotificationService.createNotification(userId, NotificationType.USER_LIKED_POST, eventData);
//     reply.send('hello 123');
// });

// fastify.listen(3000, () => {
//     console.log('Listening on port 3000');
// });

import { Application } from '@api/application';
import logger from '@common/logger';

/**
 * Entrypoint for bootstrapping and starting the application.
 * Might configure aspects like logging, telemetry, memory leak observation or even orchestration before.
 * This is about to come later!
 */

Application.createApplication().then(() => {
    logger.info('The api was started successfully!');
});
