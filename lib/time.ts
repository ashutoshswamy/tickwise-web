// Pure helpers, safe to import from client components.
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const hourLabel = (h: number) => `${h % 12 || 12}${h < 12 ? "a" : "p"}`;
export const hourRange = (h: number) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"} to ${(h + 1) % 12 || 12} ${h + 1 < 12 || h + 1 === 24 ? "AM" : "PM"}`;
