import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function DeletePost() {
  const { _id } = useParams(); // ✅ Use _id since MongoDB stores it that way
  const [redirect, setRedirect] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:5000/post/${_id}`); // ✅ Using _id
        if (!response.ok) throw new Error(`Failed to fetch post (Status: ${response.status})`);

        const postInfo = await response.json();
        setPost(postInfo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [_id]); // ✅ Using _id as dependency

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/post/${_id}`, { // ✅ Using _id
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete post");
      }

      alert("Post deleted successfully");
      setRedirect(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {post && (
        <div>
          <h2>Are you sure you want to delete this post?</h2>
          <h3>{post.title || "Untitled Post"}</h3>
          <p>{post.summary || "No summary available"}</p>

          <button 
            onClick={handleDelete} 
            disabled={deleting}
            style={{
              marginRight: "10px",
              background: deleting ? "gray" : "red",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            {deleting ? "Deleting..." : "Delete Post"}
          </button>

          <button 
            onClick={() => setRedirect(true)}
            style={{
              background: "blue",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
