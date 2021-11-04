import { FilterQuery } from "@mikro-orm/core";
import { Service } from "typedi";
import IdentityContext from "../IdentityContext";
import { User } from "./User.entity";

@Service()
export default class UsersRepository {
    createAsync(user: User) {
        return IdentityContext.instance.users.persistAndFlush(user)
    }

    getFirstAsync(where: FilterQuery<User>): Promise<User | null> {
        return IdentityContext.instance.users.findOne(where)
    }
}
