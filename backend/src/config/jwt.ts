import { Secret } from "jsonwebtoken";

console.log("ACCESS TOKEN SECRET:", process.env.ACCESS_TOKEN_SECRET);
export const jwtConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as Secret,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as Secret,
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
};
