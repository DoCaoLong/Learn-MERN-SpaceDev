import { config } from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

config();

export const EMAIL = {
  USER: process.env.EMAIL_USERNAME,
  PASS: process.env.EMAIL_PASSWORD,
};
