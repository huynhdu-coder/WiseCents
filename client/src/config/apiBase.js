export const API_BASE =
  process.env.REACT_APP_BACKEND ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "");
