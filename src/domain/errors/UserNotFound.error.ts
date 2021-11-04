import { NotFoundError } from "@/utils/errors/NotFound.error";

export class UserNotFoundError extends NotFoundError {
    constructor(options: { propertyName?: string, propertyValue?: string }) {
        if (options.propertyName && options.propertyValue)
            super('User', options.propertyName, options.propertyValue)

        console.log({ options })
    }
}