import { Router } from "express";
import { upload } from "../middleware/file.middleware";
import { HttpResponse } from "../utils/HttpResponse";
export const fileRouter = Router();

fileRouter.post("/upload", upload.single("file"), (req, res) => {
  res.json(
    HttpResponse.success({
      filename: `/upload/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    })
  );
});

fileRouter.post("/uploads", upload.array("files"), (req, res) => {
  let resData = req.files.map((e) => ({
    filename: `/upload/${e.filename}`,
    size: e.size,
    mimetype: e.mimetype,
  }));
  res.json(HttpResponse.success(resData));
});
