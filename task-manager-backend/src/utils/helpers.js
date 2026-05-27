export const createResponse = (data, status = 200) => ({
  status,
  data
});

export const createError = (message, status = 400) => ({
  status,
  error: message
});