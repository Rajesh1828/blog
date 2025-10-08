import React from "react";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <BlogForm />
      <hr />
      <BlogList />
    </div>
  );
}

export default App;
