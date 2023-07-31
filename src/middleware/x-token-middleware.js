export const xTokenMiddleware = (req, res, next) => {
  if (req.headers["x-token"] === "spacedev.vn") {
    return next();
  }
  next("Not allow");
};
