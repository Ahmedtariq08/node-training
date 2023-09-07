enum StatusCodes {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    REQUEST_TIMEOUT = 408,
    INTERNAL_SERVER_ERROR = 500,
}

export class AppResponse {
    public message: string;
    public statusCode: StatusCodes;
    public isSuccess: boolean;

    constructor(message: string, statusCode: StatusCodes, isSuccess: boolean) {
        this.message = message;
        this.statusCode = statusCode;
        this.isSuccess = isSuccess;
    }
}

// Error classes
class AppError extends AppResponse {
    constructor(message: string, statusCode: StatusCodes) {
        super(message, statusCode, false);
    }
}

export class BadRequest extends AppError {
    constructor(message: string = 'Bad Request') {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

export class Unauthorized extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal Server Error') {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// Success classes
class AppSuccess extends AppResponse {
    constructor(message: string, statusCode: StatusCodes) {
        super(message, statusCode, true);
    }
}

export class Success extends AppSuccess {
    constructor(message: string = 'Request Successful') {
        super(message, StatusCodes.SUCCESS);
    }
}

export class Created extends AppSuccess {
    constructor(message: string = 'Resource Created Successfully') {
        super(message, StatusCodes.CREATED);
    }
}

export type GenericResponse = Success | Created | BadRequest | Unauthorized | InternalServerError;
