import React, { useState } from "react";
import { api } from "../api";

const BlogForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [sections, setSections] = useState([{ h1: "", h2: "", image: null }]);
  const [loading, setLoading] = useState(false);

  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const addSection = () => setSections([...sections, { h1: "", h2: "", image: null }]);

  const deleteSection = (index) => {
    if (!window.confirm("Delete this section..?")) return;
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections.length ? newSections : [{ h1: "", h2: "", image: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("tags", tags);
    formData.append("sections", JSON.stringify(sections.map(s => ({ h1: s.h1, h2: s.h2 }))));

    if (coverImage) formData.append("coverImage", coverImage);

    // Append section images with index-based keys
    sections.forEach((s, i) => {
      if (s.image) formData.append(`sectionImage_${i}`, s.image);
    });

    try {
      await api.post("/blogs", formData);
      alert(" Blog added successfully!");
      setTitle("");
      setAuthor("");
      setTags("");
      setCoverImage(null);
      setSections([{ h1: "", h2: "", image: null }]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(" Error adding blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700   transition-all  ease-in-out duration-300">
        {showForm ? "Close Form" : "Add Blog"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 border border-gray-300 p-6 rounded-lg shadow-md bg-white space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Blog</h2>

          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
          <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} disabled={loading} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
          <input type="text" placeholder="Tags comma separated" value={tags} onChange={(e) => setTags(e.target.value)} disabled={loading} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />

          <div>
            <label className="block text-gray-700 font-medium mb-1">Cover Image</label>

            <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} disabled={loading} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />
          </div>

          {sections.map((s, i) => (
            <div key={i} className="mt-4 border border-gray-300 p-4 rounded-md bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">Section {i + 1}</h3>
                {sections.length > 1 && <button type="button" onClick={() => deleteSection(i)} disabled={loading} className="text-sm px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">Delete</button>}
              </div>


              <input type="text" placeholder="SubTitle" value={s.h1} onChange={(e) => handleSectionChange(i, "h1", e.target.value)} disabled={loading} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
              <input type="text" placeholder="Description" value={s.h2} onChange={(e) => handleSectionChange(i, "h2", e.target.value)} disabled={loading} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
              <div>
                <label className="block text-gray-700 font-medium mb-1">Section Image</label>
                <input type="file" onChange={(e) => handleSectionChange(i, "image", e.target.files[0])} disabled={loading} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={addSection} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">+ Add Section</button>
            <button type="submit" disabled={loading} className={`px-4 py-2 rounded-md text-white transition duration-200 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>{loading ? "Adding Blog..." : "Submit Blog"}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogForm;
