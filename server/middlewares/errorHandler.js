import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorResponse = {
    success: false,
    message: message
  };

  // Log 500 internal errors to the server console for debuggability
  if (!err.statusCode || err.statusCode === 500) {
    console.error(`[Error] Internal Server Error on ${req.method} ${req.originalUrl}:`, err);
  }

  // Handle express malformed JSON parsing error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = "Invalid JSON syntax in request body.";
    errorResponse.message = message;
  }
  // Handle ApiError
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorResponse.message = message;
  }
  // Handle Mongoose ValidationError
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map(val => val.message);
    message = `Validation Error: ${messages.join(", ")}`;
    errorResponse.message = message;
  }
  // Handle Mongoose CastError (invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errorResponse.message = message;
  }
  // Handle Mongoose duplicate key error
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists.`;
    errorResponse.message = message;
  }
  // Handle JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
    errorResponse.message = message;
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired.";
    errorResponse.message = message;
  }
  // Handle other errors
  else if (err.message) {
    message = err.message;
    errorResponse.message = message;
  }

  // Include stack trace in development mode
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
