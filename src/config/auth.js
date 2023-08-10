import { config } from "dotenv";
config();

export const AUTH = {
  SECRET_KEY: process.env.JWT_SECRET_KEY,
  EXPIRED_IN: process.env.JWT_EXPIRED_IN,
  REFRESH_TOKEN_EXPIRED_IN: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN,
};
