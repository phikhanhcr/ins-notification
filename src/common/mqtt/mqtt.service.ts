import { TOPIC_USER_GLOBAL } from '@config/mqtt.topic';
import { MQTTAdapter } from './MQTTAdapter';

export class MqttService {
    static async actionPostUser(userId: number, data: object): Promise<void> {
        const topicName = TOPIC_USER_GLOBAL({ user_id: userId });
        await MQTTAdapter.pushMessage(topicName, { message: 'oke em 12312' }, { retain: false, qos: 1 });
    }
}
