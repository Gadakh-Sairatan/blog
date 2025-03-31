import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { FaUserCircle } from "react-icons/fa";
import blogimg from "../Components/lg-1.avif";
import "../styles/styles.css"; 

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/profile", { credentials: "include" })
      .then(response => response.json())
      .then(userInfo => setUserInfo(userInfo));
  }, []);

  function logout() {
    fetch("http://localhost:5000/logout", {
      credentials: "include",
      method: "POST",
    }).then(() => {
      setUserInfo(null);
      navigate("/");
    });
  }

  const username = userInfo?.username;

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src={blogimg} alt="Logo" className="logo-img" />
      </Link>

      <nav>
        {username ? (
          <>
            <Link to="/create" className="nav-link">Create new post</Link>

            {/* Dropdown Container */}
            <div className="dropdown-container">
              <span className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle size={20} className="user-icon" />
                {username} ▼
              </span>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <ul className="dropdown-list">
                    <li className="dropdown-item" onClick={() => navigate("/")}>🏠 Home</li>
                    <li className="dropdown-item" onClick={() => navigate("/profile")}>👤 My Profile</li>
                    <li className="dropdown-item" onClick={() => navigate("/my-blogs")}>📝 My Blogs</li>
                    <li className="dropdown-item logout" onClick={logout}>🚪 Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="nav-link">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
