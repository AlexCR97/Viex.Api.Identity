import { MikroORM } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/mongodb";
import { RefreshToken } from "./refreshTokens/RefreshToken.entity";
import { User } from "./users/User.entity";

export default class IdentityContext {
    
    private static _instance: IdentityContext

    readonly users: EntityRepository<User>
    readonly refreshTokens: EntityRepository<RefreshToken>
    private readonly orm: MikroORM

    private constructor(orm: MikroORM) {
        this.orm = orm
        this.users = orm.em.getRepository(User)
        this.refreshTokens = orm.em.getRepository(RefreshToken)
    }

    static init(orm: MikroORM) {
        this._instance = new IdentityContext(orm)
    }

    static get instance() {
        if (!this._instance)
            throw 'ExpensesContext instance has not been initialized'

        return this._instance
    }

    flushAsync() {
        return this.orm.em.flush()
    }
}
