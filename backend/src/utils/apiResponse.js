class ApiResponse {
  static success(res, message, data = null, statusCode = 200, meta = {}) {
    const response = {
      success: true,
      message,
      ...(data !== null && { data }),
      ...meta
    };
    return res.status(statusCode).json(response);
  }

  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      statusCode
    });
  }
}

module.exports = ApiResponse;
