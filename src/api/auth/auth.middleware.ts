import { APIError } from '@common/error/api.error';
import { TokenService } from '@common/token/token.service';
import { ErrorCode } from '@config/errors';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction, onRequestHookHandler } from 'fastify';

import httpStatus from 'http-status';
export class AuthMiddleware {
    /**
     * Authenticate middleware, SHOULD NOT USE unless need custom auth
     * @param allowedUserTypes
     */
    static authenticate(): onRequestHookHandler {
        return async (req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction): Promise<void> => {
            try {
                const user = await TokenService.getAuthInfoFromToken(req.headers.authorization.split(' ')[1]);
                if (!user) {
                    throw new APIError({
                        message: 'common.unauthorized',
                        status: httpStatus.UNAUTHORIZED,
                        errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                    });
                }
                req.user = user;
                next();
            } catch (error) {
                next(error);
            }
        };
    }

    static requireAuth = AuthMiddleware.authenticate();
}
