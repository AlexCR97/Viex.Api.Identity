import AuthService from "@/domain/services/auth/Auth.service"
import { Request, Response } from "express"
import { Inject, Service } from "typedi"

@Service()
export default class AuthController {

    @Inject() private readonly _authService!: AuthService

    async authenticateAsync(request: Request, response: Response) {
        const authToken = await this._authService.authenticateAsync(request.body)
        response.json(authToken)
    }

    async logout(request: Request, response: Response) {
        await this._authService.logout(request.body)
        response.sendStatus(204)
    }
    
    async refreshToken(request: Request, response: Response) {
        const accessTokenModel = await this._authService.refreshToken(request.body)
        response.json(accessTokenModel)
    }
}