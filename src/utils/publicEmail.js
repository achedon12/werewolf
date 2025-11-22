export const fromAddress = process.env.NEXT_PUBLIC_FROM_ADDRESS || "contact@werewolf.app";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://werewolf.leoderoin.fr");