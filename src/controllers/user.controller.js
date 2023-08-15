import { BadRequest, Success } from "../config/statusCode";
import { User, UserModel } from "../models/user.model";
import { HttpResponse } from "../utils/HttpResponse";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail";
import { randomCode } from "../utils/randomCode";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const emailRegisterHtml = fs
  .readFileSync(path.join(__dirname, "../views/emails/register.html"))
  .toString();

const forfotPasswordHtml = fs
  .readFileSync(path.join(__dirname, "../views/emails/forgot-password.html"))
  .toString();

export const UserController = {
  get: async (req, res) => {
    let detail = await User.paginate(req.query);
    if (detail) {
      return res.status(Success).json(HttpResponse.Paginate(detail));
    }
    res.status(BadRequest).json(HttpResponse.error("User not found"));
  },

  getDetail: async (req, res) => {
    let detail = await User.findById(req.params.id);
    if (detail) {
      return res.status(Success).json(HttpResponse.detail(detail));
    }
    res.status(BadRequest).json(HttpResponse.error("User not found"));
  },

  create: async (req, res) => {
    const { name, age, gender, avatar } = req.body;
    res
      .status(Success)
      .json(
        HttpResponse.created(await User.create({ name, age, gender, avatar }))
      );
  },

  updateById: async (req, res) => {
    const { name } = req.body;
    const id = req.user; // lấy Id user từ middle ware
    let check = await User.updateById(id, { name });
    if (check) {
      res.status(Success).json(HttpResponse.updated(check));
    } else {
      res.status(BadRequest).json(HttpResponse.error("User not found"));
    }
  },

  deleteById: async (req, res) => {
    let check = await User.deleteById(req.params.id);
    if (check) {
      res.status(Success).json({ Delete: true });
    } else {
      res.status(BadRequest).json(HttpResponse.error("Delete error"));
    }
  },

  register: async (req, res, next) => {
    try {
      let check = await UserModel.findOne({ email: req.body.email });
      if (check) {
        return res
          .status(BadRequest)
          .json(HttpResponse.error("Email này đã tồn tại"));
      }
      let { password, email, name } = req.body;
      password = crypto.createHash("sha256").update(password).digest("hex");
      let code = randomCode(100);
      let user = await User.create({ ...req.body, password, code });
      user.password = undefined; // hidden field password

      // send mail
      await sendMail({
        from: '"Spacedev.vn 👻" <study@spacedev.vn>', // sender address
        to: email, // list of receivers
        subject: "Kích hoạt tài khoản spacedev.vn", // Subject line
        html: emailRegisterHtml, // html body
        data: {
          link: `http://localhost:8000/user/verify-register?code=${code}&email=${email}`,
          name: name,
        },
      });
      // close send mail

      res.status(Success).json(HttpResponse.success(user));
    } catch (error) {
      next(error);
    }
  },

  verifyRegister: async (req, res, next) => {
    try {
      let { code, email } = req.query;
      let user = await UserModel.findOne({
        email,
        code,
        verify: false,
      });
      if (user) {
        user.verify = true;
        user.code = null;
        await user.save();
        return res.json({ success: true });
      }

      return res.status(BadRequest).json(HttpResponse.error("Thao tác lỗi"));
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      let { email, redirect } = req.body;
      let user = await UserModel.findOne({ email });

      if (!user) {
        return res
          .status(BadRequest)
          .json(HttpResponse.error("User này không tồn tại"));
      }

      let code = randomCode(100);
      user.code = code;
      await user.save();
      await sendMail({
        from: '"Spacedev.vn 👻" <study@spacedev.vn>', // sender address
        to: email, // list of receivers
        subject: "Tìm lại tài khoản spacedev.vn", // Subject line
        html: forfotPasswordHtml, // html body
        data: {
          link: `${redirect}?code=${code}&email=${email}`,
        },
      });

      res.json(
        HttpResponse.success("Vui lòng kiểm tra email để tìm lại mật khẩu")
      );
    } catch (err) {
      next(err);
    }
  },

  resetPasswordByCode: async (req, res, next) => {
    try {
      let { code, email, newPassword } = req.body;
      let user = await UserModel.findOne({
        email,
        code,
      });
      if (user) {
        user.code = null;
        let password = crypto
          .createHash("sha256")
          .update(newPassword)
          .digest("hex");
        user.password = password;

        await user.save();
        return res.json(HttpResponse.success("Reset password thành công"));
      }

      return res.status(BadRequest).json(HttpResponse.error("Thao tác lỗi"));
    } catch (err) {
      next(err);
    }
  },

  // resetPasswordByCode: async (req, res, next) => {
  //   try {
  //     let { code, email, oldPassword, newPassword } = req.body;

  //     const oldPasswordHash = crypto
  //       .createHash("sha256")
  //       .update(oldPassword)
  //       .digest("hex");

  //     let user = await UserModel.findOne({
  //       email,
  //       code,
  //       password: oldPasswordHash,
  //     });

  //     if (user) {
  //       // Mật khẩu cũ đúng, thực hiện thay đổi mật khẩu
  //       const newPasswordHash = crypto
  //         .createHash("sha256")
  //         .update(newPassword)
  //         .digest("hex");
  //       user.password = newPasswordHash;

  //       await user.save();

  //       return res.json(HttpResponse.success("Reset password thành công"));
  //     }

  //     return res.status(BadRequest).json(HttpResponse.error("Thao tác lỗi"));
  //   } catch (err) {
  //     next(err);
  //   }
  // },
};
