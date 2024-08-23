// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error stack trace for debugging

  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message,
    });
  }

  // Other types of errors (programming errors, bugs, etc.)
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
