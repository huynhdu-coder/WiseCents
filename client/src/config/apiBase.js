export const API_BASE =
  process.env.REACT_APP_BACKEND ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "");
console.log("BACKEND:", process.env.REACT_APP_BACKEND);


if (!API_BASE) {
  console.error(" REACT_APP_BACKEND is not defined");
}
