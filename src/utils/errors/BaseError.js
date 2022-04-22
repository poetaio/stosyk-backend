class BaseError extends Error {
    constructor(name, status, message) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.status = status;
        this.message = message;
        Error.captureStackTrace(this);
    }
}

module.exports = BaseError;
