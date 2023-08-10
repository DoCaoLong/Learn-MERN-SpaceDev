import jsonwebtoken from "jsonwebtoken";
import { AUTH } from "../config/auth";

export const jwtMiddleware = (req, res, next) => {
  let { authorization } = req.headers;

  if (!authorization) {
    return next("Api yêu cầu quyền truy cập");
  }

  // check time còn thời hạn k, đúng là 1 accessToken hay k
  let check = jsonwebtoken.verify(
    authorization.replace("Bearer ", ""),
    AUTH.SECRET_KEY
  );
  // console.log("check", check); // -> check { _id: '64d20b4d213d6e4bff1e6a26', iat: 1691552057, exp: 1691552087 }

  if (check) {
    req.user = check._id; // gắn user = id để qua controller lấy ra
    return next();
  }

  next("Token invalid");
};
