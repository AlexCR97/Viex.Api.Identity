import { DomainError } from "./Domain.error";

export class InvalidPayloadPropertyError extends DomainError {
    constructor(propertyName: string, propertyValue: any) {
        super(400, `Request payload has an invalid property ("${propertyName}": ${propertyValue})`)
    }
}