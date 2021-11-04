export class DomainError extends Error {

    constructor(
        readonly statusCode: number,
        readonly message: string,
    ) {
        super(message)
    }
}