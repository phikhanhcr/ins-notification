import { IAuthUser } from '@common/auth/auth.interface';
import logger from '@common/logger';
import { JWT_PUBLIC_KEY } from '@config/environment';
import jwt, { SignOptions } from 'jsonwebtoken';

interface AccessToken {
    token: string;
    expired_at: Date;
}

interface TokenPayload {
    iss: string;
    name: string;
    sub: string; // User ID
    device_id: string;
}

const JWT_ALGORITHM = 'RS256';
const JWT_ISSUER = 'instagram';

export class TokenService {
    // do something
    static async verifyAccessToken(token: string): Promise<TokenPayload> {
        return (await jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: [JWT_ALGORITHM] })) as TokenPayload;
    }

    static async getAuthInfoFromToken(token: string): Promise<IAuthUser> {
        try {
            const tokenInfo = await TokenService.verifyAccessToken(token);
            return {
                id: +tokenInfo.sub,
                name: tokenInfo.name,
            };
        } catch (error) {
            logger.error(error);
        }
    }
}
