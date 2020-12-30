export const parseError = (error) => {
  const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  if (message === "Not authorized, token failed") {
    dispatch(logout());
  }
  return message;
};
