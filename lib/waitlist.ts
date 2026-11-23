// WAITLIST_ENABLED=true: home redirects to /waitlist and new accounts are refused. Existing users unaffected.
export const waitlistOn = () => process.env.WAITLIST_ENABLED === "true";
