import { UserNotFoundError } from "@/domain/errors/UserNotFound.error"
import UsersRepository from "@/persistence/mongo/users/User.repository"
import { Inject, Service } from "typedi"
import { AuthenticateModel } from "./Authenticate.model"
import bcrypt from 'bcrypt'
import { AuthenticationFailedError } from "@/domain/errors/AuthenticationFailed.error"
import { UserToken } from "./UserToken.model"
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import config from '@/config.json'
import { AuthToken } from "./AuthToken.model"
import { RefreshTokenModel } from "./RefreshToken.model"
import RefreshTokensRepository from "@/persistence/mongo/refreshTokens/RefreshToken.repository"
import { InvalidRefreshTokenError } from "@/domain/errors/InvalidRefreshToken.error"
import { AccessTokenModel } from "./AccessToken.model"
import { InvalidPayloadPropertyError } from "@/utils/errors/InvalidPayloadProperty.error"
import { RefreshToken } from "@/persistence/mongo/refreshTokens/RefreshToken.entity"

@Service()
export default class AuthService {

    @Inject() private readonly _usersRepository!: UsersRepository
    @Inject() private readonly _refreshTokens!: RefreshTokensRepository

    async authenticateAsync(authenticateModel: AuthenticateModel): Promise<AuthToken> {
        const user = await this._usersRepository.getFirstAsync({ email: authenticateModel.email })

        if (!user)
            throw new UserNotFoundError({ propertyName: 'email', propertyValue: authenticateModel.email })
        
        const isPasswordValid = await bcrypt.compare(authenticateModel.password, user.password)

        if (!isPasswordValid)
            throw new AuthenticationFailedError()

        const token: UserToken = { email: user.email }
        const accessToken = jwt.sign(token, config.authentication.accessToken.secret, { expiresIn: config.authentication.accessToken.expiresIn })
        const refreshToken = jwt.sign(token, config.authentication.refreshToken.secret)

        const refreshTokenEntity = new RefreshToken()
        refreshTokenEntity.token = refreshToken
        await this._refreshTokens.createAsync(refreshTokenEntity)

        return { accessToken, refreshToken }
    }

    async logout(refreshTokenModel: RefreshTokenModel) {
        const refreshToken = refreshTokenModel.refreshToken

        if (!refreshToken)
            throw new InvalidPayloadPropertyError('refreshToken', refreshToken)

        await this._refreshTokens.deleteWhereAsync({ token: refreshToken })
    }

    async refreshToken(refreshTokenModel: RefreshTokenModel): Promise<AccessTokenModel> {
        const refreshToken = refreshTokenModel.refreshToken

        if (!refreshToken)
            throw new InvalidPayloadPropertyError('refreshToken', refreshToken)

        const refreshTokenSnapshot = await this._refreshTokens.getFirstAsync({ token: refreshToken })

        if (!refreshTokenSnapshot)
            throw new InvalidRefreshTokenError()

        return await verifyRefreshToken(refreshToken)
    }
}

async function verifyRefreshToken(refreshToken: string): Promise<AccessTokenModel> {
    return new Promise((resolve) => {
        jwt.verify(refreshToken, config.authentication.refreshToken.secret, (err: VerifyErrors | null, user: JwtPayload | undefined) => {
            if (err)
                throw new InvalidRefreshTokenError()
                
            if (!user)
                throw new InvalidRefreshTokenError()

            const token: UserToken = { email: user.email }

            resolve({
                accessToken: jwt.sign(token, config.authentication.accessToken.secret, { expiresIn: config.authentication.accessToken.expiresIn })
            })
        })
    })
}