export const API_BASE =
  process.env.REACT_APP_BACKEND ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : undefined);

if (!API_BASE) {
  throw new Error("REACT_APP_BACKEND is not defined");
}
