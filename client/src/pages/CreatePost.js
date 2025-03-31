import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Components/Editor";
import "../styles/styles.css";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    const response = await fetch('http://localhost:5000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div 
      className="popup-container"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        background: "#fff",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        zIndex: 1000,
      }}
    >
      {/* ✅ Properly positioned close button (top-right corner) */}
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "-250px",
          background: "none",
          border: "none",
          fontSize: "24px",
          fontWeight: "bold",
          color: "red",
          cursor: "pointer",

        }}
        onClick={() => setRedirect(true)} // ✅ Redirects to home page
      >
        ✖
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>New Post</h2>

      <form onSubmit={createNewPost}>
        <input 
          type="title" 
          placeholder="Title" 
          value={title} 
          onChange={ev => setTitle(ev.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input 
          type="summary" 
          placeholder="Summary" 
          value={summary} 
          onChange={ev => setSummary(ev.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input 
          type="file" 
          onChange={ev => setFiles(ev.target.files)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <Editor value={content} onChange={setContent} />
        <button 
          style={{ 
            width: "100%", 
            backgroundColor: "green", 
            color: "white", 
            padding: "10px", 
            marginTop: "10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Create post
        </button>
      </form>
    </div>
  );
}
