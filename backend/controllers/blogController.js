import fs from "fs";
import Blog from "../models/Blog.js";
import cloudinary from "../utils/cloudinary.js";

export const createBlog = async (req, res) => {
  try {
    const sections = JSON.parse(req.body.sections || "[]");
    const files = req.files || [];

    // Cover Image
    const coverImageFile = files.find(f => f.fieldname === "coverImage");
    let coverImageUrl = null;
    if (coverImageFile) {
      const result = await cloudinary.uploader.upload(coverImageFile.path, {
        folder: "blogs/coverImages",
      });
      coverImageUrl = result.secure_url;
      fs.unlinkSync(coverImageFile.path); 
    }

    // Section Images
    const updatedSections = await Promise.all(
      sections.map(async (section, index) => {
        const imageFile = files.find(f => f.fieldname === `sectionImage_${index}`);
        console.log(imageFile);
        let imageUrl = null;

        if (imageFile) {
          const result = await cloudinary.uploader.upload(imageFile.path, {
            folder: "blogs/sections",
          });
          imageUrl = result.secure_url;
          fs.unlinkSync(imageFile.path);
        }

        return {
          h1: section.h1 || "",
          h2: section.h2 || "",
          image: imageUrl,
        };
      })
    );

    const newBlog = new Blog({
      title: req.body.title || "Untitled Blog",
      author: req.body.author || "Anonymous",
      tags: req.body.tags ? req.body.tags.split(",").map(t => t.trim()) : [],
      coverImage: coverImageUrl,
      sections: updatedSections,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
};
