import { useEffect, useState, useContext } from "react";
import { UserContext } from "../Components/UserContext";
import { Link } from "react-router-dom";
import "../styles/styles.css";

export default function MyBlogs() {
  const { userInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userInfo?.id) return;

    fetch(`http://localhost:5000/my-blogs/${userInfo.id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [userInfo]);

  return (
    <div className="my-blogs">
      <h1>My Blogs</h1>

      {posts.length === 0 ? (
        <p className="no-blogs">No blogs created yet.</p>
      ) : (
        posts.map((post) => (
          <div className="blog-card" key={post._id}>
            {/* ✅ Blog Image */}
            {post.cover && (
              <img className="blog-image" src={`http://localhost:5000/${post.cover}`} alt={post.title} />
            )}

            {/* ✅ Blog Title */}
            <h2>
              <Link className="blog-title" to={`/post/${post._id}`}>
                {post.title}
              </Link>
            </h2>

            {/* ✅ Blog Summary */}
            <p className="blog-summary">{post.summary}</p>
          </div>
        ))
      )}
    </div>
  );
}
