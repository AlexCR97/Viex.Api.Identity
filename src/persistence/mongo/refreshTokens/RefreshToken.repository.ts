import { FilterQuery } from "@mikro-orm/core";
import { Service } from "typedi";
import IdentityContext from "../IdentityContext";
import { RefreshToken } from "./RefreshToken.entity";

@Service()
export default class RefreshTokensRepository {
    createAsync(refreshToken: RefreshToken) {
        return IdentityContext.instance.refreshTokens.persistAndFlush(refreshToken)
    }

    async deleteWhereAsync(where: FilterQuery<RefreshToken>) {
        const snapshots = await IdentityContext.instance.refreshTokens.find(where)

        if (snapshots.length == 0)
            return
        
        for (const snapshot of snapshots)
            IdentityContext.instance.refreshTokens.remove(snapshot)

        await IdentityContext.instance.flushAsync()
    }

    getFirstAsync(where: FilterQuery<RefreshToken>): Promise<RefreshToken | null> {
        return IdentityContext.instance.refreshTokens.findOne(where)
    }
}
