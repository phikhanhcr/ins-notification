import path from 'path';
import dotenv from 'dotenv-safe';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example'),
});

export const APP_NAME: string = process.env.APP_NAME || 'demo_app';
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug';
export const LOG_OUTPUT_JSON: boolean = process.env.LOG_OUTPUT_JSON === '1';

export const PORT: number = parseInt(process.env.PORT, 10) || 3000;

export const REDIS_URI: string = process.env.REDIS_URI;

export const DATABASE_URI: string = process.env.DATABASE_URI;

export const MQTT_URI: string = process.env.MQTT_URI;

export const EMQX_USERNAME: string = process.env.EMQX_USERNAME;
export const EMQX_URI: string = process.env.EMQX_URI;
export const EMQX_PASSWORD: string = process.env.EMQX_PASSWORD;
export const MQTT_USERNAME: string = process.env.MQTT_USERNAME;
export const MQTT_PASSWORD: string = process.env.MQTT_PASSWORD;

export const KAFKA_BROKERS: string[] = process.env.KAFKA_BROKERS.split(',').filter((key) => key.trim() !== '');
