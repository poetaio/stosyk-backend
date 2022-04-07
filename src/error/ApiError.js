module.exports = class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
    }

    static badRequest(message) {
        return new ApiError(message, 400);
    }

    static unauthorised(message) {
        return new ApiError(message, 401);
    }

    static internal(message) {
        return new ApiError(message, 500);
    }
}
