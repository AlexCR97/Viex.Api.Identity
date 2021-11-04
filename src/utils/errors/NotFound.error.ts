import { DomainError } from "./Domain.error"

export class NotFoundError extends DomainError {
    constructor(
        className: string,
        propertyName: string,
        propertyValue: any
    ) {
        super(404, `Could not find ${className} with ${propertyName} "${propertyValue}"`)
    }
}
