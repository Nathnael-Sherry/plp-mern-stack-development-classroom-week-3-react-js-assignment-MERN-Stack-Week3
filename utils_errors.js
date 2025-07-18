class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

module.exports = { NotFoundError, ValidationError };