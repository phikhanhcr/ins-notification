import { APIError } from '@common/error/api.error';
import httpStatus from 'http-status';
import { NODE_ENV } from '@config/environment';
import { ErrorCode } from '@config/errors';
import logger from '@common/logger';
import { pick } from 'lodash';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from 'joi';

export class ResponseMiddleware {
    /**
     * Handle error
     * @param err APIError
     * @param req
     * @param res
     * @param next
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static handler(err: APIError, req: FastifyRequest, res: FastifyReply): void {
        const { status = httpStatus.INTERNAL_SERVER_ERROR, errorCode = 1 } = err;

        const response = {
            error: errorCode,
            message: err.message ? err.message : httpStatus[status],
            stack: err.stack,
        };

        if (NODE_ENV !== 'development') {
            delete response.stack;
        }
        res.status(status).send(response);
    }

    /**
     * Convert error if it's not APIError
     * @param err
     * @param req
     * @param res
     * @param next
     */
    static error(err: Error, req: FastifyRequest, res: FastifyReply): void {
        let convertedError: APIError;

        if (err instanceof ValidationError) {
            convertedError = new APIError({
                message: ResponseMiddleware.getMessageOfValidationError(err),
                status: httpStatus.BAD_REQUEST,
                stack: err.stack,
                errorCode: ErrorCode.VERIFY_FAILED,
            });
        } else if (err instanceof APIError) {
            convertedError = err;
        } else {
            convertedError = new APIError({
                message: err.message,
                status: httpStatus.INTERNAL_SERVER_ERROR,
                stack: err.stack,
                errorCode: ErrorCode.SERVER_ERROR,
            });
        }
        // log error for status >= 500
        if (convertedError.status >= httpStatus.INTERNAL_SERVER_ERROR) {
            logger.error('Process request error:', {
                stringData: JSON.stringify(err),
                ...pick(req, ['originalUrl', 'body', 'rawHeaders']),
            });
        }

        return ResponseMiddleware.handler(convertedError, req, res);
    }

    /**
     * Notfound middleware
     * @param req
     * @param res
     */
    static notFound(req: FastifyRequest, res: FastifyReply): void {
        const customErr = new APIError({
            message: 'Not found',
            status: httpStatus.NOT_FOUND,
            stack: '',
            errorCode: ErrorCode.REQUEST_NOT_FOUND,
        });
        return ResponseMiddleware.handler(customErr, req, res);
    }

    static getMessageOfValidationError(error: ValidationError): string {
        const details = error.details;
        if (details.length > 0) {
            return details[0].message;
        }
        return 'Validation error!';
    }
}
