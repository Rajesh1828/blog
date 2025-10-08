import React, { useEffect, useState } from "react";
import { api } from "../api";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Error deleting blog");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">All Blogs</h2>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-600 text-lg">No blogs found.</p>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="border border-gray-300 rounded-lg shadow-sm bg-white p-5 mb-6 hover:shadow-md transition duration-200"
          >
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {blog.title}
            </h3>

            {/* Cover Image */}
            {blog.coverImage && (
              <img
                src={blog.coverImage} 
                alt="cover"
                className="w-full max-w-lg mt-2 mb-4 rounded-md object-cover"
              />
            )}

            {/* Author & Tags */}
            <p className="text-gray-700">
              <span className="font-semibold">Author:</span> {blog.author}
            </p>

            {blog.tags && blog.tags.length > 0 && (
              <p className="text-gray-700 mt-1">
                <span className="font-semibold">Tags:</span>{" "}
                {blog.tags.join(", ")}
              </p>
            )}

            {/* Blog Sections */}
            {blog.sections && blog.sections.length > 0 ? (
              <div className="mt-4 space-y-4">
                {blog.sections.map((s, i) => (
                  <div key={i} className="border-t border-gray-200 pt-3">
                    {s.h1 && (
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        {s.h1}
                      </h4>
                    )}
                    {s.h2 && <p className="text-gray-700">{s.h2}</p>}

                    {/* Section image */}
                    {s.image && (
                      <img
                        src={s.image} 
                        alt={`Section ${i}`}
                        className="max-w-sm mt-3 rounded-md object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-3">No sections available</p>
            )}

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(blog._id)}
              className="mt-5 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogList;
