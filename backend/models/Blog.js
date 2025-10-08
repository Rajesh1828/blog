import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  h1: { type: String, default: "" },
  h2: { type: String, default: "" },
  image: { type: String, default: null },
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    coverImage: { type: String, default: "" },
    tags: { type: [String], default: [] },
    sections: [sectionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
