import { DomainError } from "@/utils/errors/Domain.error";

export class ExpiredRefreshTokenError extends DomainError {
    constructor() {
        super(403, 'Your refresh token has expired')
    }
}