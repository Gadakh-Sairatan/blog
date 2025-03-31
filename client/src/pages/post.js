import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../Components/UserContext";
import "../styles/styles.css"; 

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Used for redirection

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => setPostInfo(postInfo))
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  // ✅ Handle post deletion
  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/post/${postInfo._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error deleting post:", errorText);
        alert(`Failed to delete post: ${response.status} ${response.statusText}`);
        return;
      }

      alert("Post deleted successfully");
      navigate("/"); // ✅ Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  }

  if (!postInfo) return <p>Loading...</p>;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      {postInfo.createdAt && <time>{formatISO9075(new Date(postInfo.createdAt))}</time>}
      {postInfo.author && <div className="author">by @{postInfo.author.username}</div>}

      {/* ✅ Edit/Delete Buttons (only for post author) */}
      {userInfo && postInfo.author && userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>✏️ Edit</Link>
          <button className="delete-btn" onClick={handleDelete}> ❌ Delete </button>
        </div>
      )}

      {/* ✅ Post Cover Image */}
      {postInfo.cover && (
        <div className="image">
          <img src={`http://localhost:5000/${postInfo.cover}`} alt="Post Cover" />
        </div>
      )}

      {/* ✅ Post Content */}
      {postInfo.content && (
        <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      )}

      {/* ✅ Back Button (Moved to Bottom) */}
      <button className="back-btn" onClick={() => navigate(-1)}>⬅️ Back</button>
    </div>
  );
}
