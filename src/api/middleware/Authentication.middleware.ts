import { AccessTokenError } from '@/domain/errors/AccessToken.error'
import { AuthHeaderError } from '@/domain/errors/AuthHeader.error'
import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import config from '@/config.json'
import { InvalidAccessTokenError } from '@/domain/errors/InvalidAccessToken.error'

export default function(request: Request, _response: Response, next: NextFunction) {
    const authHeader = request.headers['authorization']

    if (!authHeader)
        throw new AuthHeaderError()

    const accessToken = authHeader.split(' ')[1] // "Bearer accessToken"

    if (!accessToken)
        throw new AccessTokenError()

    jwt.verify(accessToken, config.authentication.accessToken.secret, (error: VerifyErrors | null, user: JwtPayload | undefined) => {
        if (error)
            throw new InvalidAccessTokenError();
        
        (request as any).user = user
        next()
     })
}
