import express from "express";
import { createBlog, getAllBlogs, deleteBlog } from "../controllers/blogController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.any(), createBlog);


router.get("/", getAllBlogs);

router.delete("/:id", deleteBlog);

export default router;
