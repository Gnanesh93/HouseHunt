// Standardized API Response Handler. Ensures consistent JSON response structure across the application

export const sendResponse = (res, statusCode, success, message, data = null, errors = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    errors,
    statusCode
  });
};

export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data, null);
};

export const sendError = (res, message, errors = null, statusCode = 500) => {
  return sendResponse(res, statusCode, false, message, null, errors);
};
