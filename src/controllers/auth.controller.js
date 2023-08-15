import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { HttpResponse } from "../utils/HttpResponse";
import { BadRequest } from "../config/statusCode";
import jsonwebtoken from "jsonwebtoken";
import { AUTH } from "../config/auth";
import { Token } from "../models/token.model";
import { config } from "dotenv";
config();

export const AuthController = {
  login: async (req, res, next) => {
    let { email, password } = req.body;

    password = crypto.createHash("sha256").update(password).digest("hex");

    let user = await UserModel.findOne({
      email,
      password,
      verify: true,
    });
    if (user) {
      let accessToken = jsonwebtoken.sign({ _id: user._id }, AUTH.SECRET_KEY, {
        expiresIn: AUTH.EXPIRED_IN,
      });

      let refreshToken = jsonwebtoken.sign({ _id: user._id }, AUTH.SECRET_KEY, {
        expiresIn: AUTH.REFRESH_TOKEN_EXPIRED_IN,
      });

      // logic chỉ login 1 nơi
      await Token.deleteMany({
        userId: user._id,
      });

      let token = new Token({ refreshToken, userId: user._id });
      await token.save();

      return res.json(HttpResponse.success({ accessToken, refreshToken }));
    }

    res
      .status(BadRequest)
      .json(HttpResponse.error("Email hoặc password không chính xác"));
  },

  refreshToken: async (req, res, next) => {
    try {
      let { refreshToken } = req.body;

      // Xác minh tính hợp lệ của refresh token
      let check = jsonwebtoken.verify(refreshToken, AUTH.SECRET_KEY);

      let checkDB = await Token.findOne({
        refreshToken,
        enabled: true,
      });

      if (checkDB) {
        let accessToken = jsonwebtoken.sign(
          { _id: check._id },
          AUTH.SECRET_KEY,
          {
            expiresIn: AUTH.EXPIRED_IN,
          }
        );

        return res.json(
          HttpResponse.success({
            accessToken,
            refreshToken,
          })
        );
      }

      next("Refresh Token Invalid");
    } catch (err) {
      next(err);
    }
  },
};
