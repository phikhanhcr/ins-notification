/* eslint-disable @typescript-eslint/ban-types */

import { IAuthUser } from '@common/auth/auth.interface';
import { IRequestInfo } from '@common/request.interface';

declare module 'fastify' {
    interface FastifyReply {
        sendJson(data: unknown): this;
    }
    interface FastifyRequest {
        getRequestInfo(): IRequestInfo;
        user: IAuthUser;
        language: string;
    }
}

export {};
