import UsersRepository from "@/persistence/mongo/users/User.repository";
import { Inject, Service } from "typedi";
import { SignUpModel } from "./SignUp.model";
import bcrypt from 'bcrypt'
import { User } from "@/persistence/mongo/users/User.entity";
import { UserProfileModel } from "./UserProfile.model";
import { UserNotFoundError } from "@/domain/errors/UserNotFound.error";

@Service()
export default class UserService {

    @Inject() private readonly _usersRepository!: UsersRepository

    async getMyProfile(): Promise<UserProfileModel> {
        const user = await this._usersRepository.getFirstAsync({ email: 'ale@live.com' }) // TODO Implement this correctly

        if (!user)
            throw new UserNotFoundError({ propertyName: 'email', propertyValue: 'random@email.com' }) // TODO Pass in proper values
        
        return {
            email: user.email,
        }
    }

    async signUpAsync(signUpModel: SignUpModel) {
        // TODO Verify email availability
        // TODO Verify password reliability

        const user = new User()
        user.email = signUpModel.email
        user.password = await bcrypt.hash(signUpModel.password, 10)

        await this._usersRepository.createAsync(user)
    }
}