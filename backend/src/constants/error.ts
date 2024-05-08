import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
    name;
    httpCode;
    message;

    constructor(name: string = "", httpCode: StatusCodes, message: string) {
        console.log("Hello");
        super(message);
        this.name = name;
        this.httpCode = httpCode;
        this.message = message;
    }
}

export const formatError = (error: any, location = "") => {
    if (error instanceof CustomError) {
        throw error;
    } else {
        // Handle other types of errors
        console.error("An unexpected error occurred:", error.message);
        throw new CustomError(
            location,
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal Server Error"
        );
    }
};
export default CustomError;
