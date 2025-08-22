class ApiError extends Error {
    constructor(message = 'something went is wrong',
        statuscode = statuscode,
        error = [],
        stack = ""
    ) {

        super(message)

        this.message = message
        this.statuscode = statuscode
        this.error = error
        this.stack = stack
        this.data = null,
        this.success = false


        if (!stack) {
            this.stack = stack

        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}



export default ApiError;

