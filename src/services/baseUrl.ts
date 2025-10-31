export type BaseUrlProdType = "local" | "live";

const getBaseUrl = (env: BaseUrlProdType = "live"): string =>
  env === "live"
    ? "https://one-universe-de5673cf0d65.herokuapp.com/api/v1"
    : "http://localhost:8000/api/v1";

export default getBaseUrl;
