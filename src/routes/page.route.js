import { Router } from "express";

export const pageRouter = Router();

pageRouter
  .get("/", (req, res) => {
    res.render(`home`, { title: "Spacedev MERN" });
  })
  .get("/courses", (req, res) => {
    res.render("course-list");
  })
  .get("/courses/:id", (req, res) => {
    res.render("course-detail");
  });
