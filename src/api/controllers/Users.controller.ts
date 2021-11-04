import UserService from "@/domain/services/users/User.service";
import { Request, Response } from "express";
import { Inject, Service } from "typedi";

@Service()
export default class UserController {

    @Inject() readonly _userService!: UserService

    async signUpAsync(request: Request, response: Response) {
        await this._userService.signUpAsync(request.body)
        response.sendStatus(201)
    }

    async getMyProfile(_request: Request, response: Response) {
        const userProfile = await this._userService.getMyProfile()
        response.json(userProfile)
    }
}