import { DomainError } from "@/utils/errors/Domain.error";

export class InvalidAccessTokenError extends DomainError {
    constructor() {
        super(403, 'Your token is invalid')
    }
}