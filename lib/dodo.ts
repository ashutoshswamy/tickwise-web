import DodoPayments from "dodopayments";

// Lazy so `next build` works without keys.
export const dodo = () =>
  new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: process.env.DODO_ENV === "live_mode" ? "live_mode" : "test_mode",
  });
export const dodoOn = () => Boolean(process.env.DODO_PAYMENTS_API_KEY && process.env.DODO_PRODUCT_ID);
