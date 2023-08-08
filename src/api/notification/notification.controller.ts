import { NotificationService } from '@common/notification/notification.service';
import { FastifyReply, FastifyRequest } from 'fastify';
export class NotificationController {
    static async getUserNotifications(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const data = await NotificationService.getUserNotifications(req.user);
            return res.send({
                message: 'Operation executed successfully!',
                data: data.map((notification) => notification.transform()),
            });
        } catch (error) {
            throw error;
        }
    }

    static async readAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const data = await NotificationService.readAll(req.user);
            return res.send({
                message: 'Operation executed successfully!',
                data: data.map((notification) => notification.transform()),
            });
        } catch (error) {
            throw error;
        }
    }
}
