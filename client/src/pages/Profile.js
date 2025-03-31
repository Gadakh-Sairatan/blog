import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Components/UserContext";

export default function Profile() {
     const { userInfo, setUserInfo } = useContext(UserContext);
     const [profilePic, setProfilePic] = useState(null);
     const [username, setUsername] = useState("");
     const [email, setEmail] = useState("");
     const [birthdate, setBirthdate] = useState("");
     const [bio, setBio] = useState("");
     const [error, setError] = useState("");

     useEffect(() => {
          if (userInfo) {
               setUsername(userInfo.username || "");
               setEmail(userInfo.email || "");
               setBirthdate(userInfo.birthdate || "");
               setBio(userInfo.bio || "");
               setProfilePic(userInfo.profilePic || "");
          }
     }, [userInfo]);

     async function handleProfileUpdate(e) {
          e.preventDefault();
          setError(""); // Clear previous errors

          try {
               const formData = new FormData();
               formData.append("username", username);
               formData.append("email", email);
               formData.append("birthdate", birthdate);
               formData.append("bio", bio);

               if (profilePic instanceof File) {
                    formData.append("profilePic", profilePic);
               }

               const response = await fetch("http://localhost:5000/api/users/update", {
                    method: "PUT",
                    body: formData,
                    credentials: "include",
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || "Failed to update profile.");
               }

               setUserInfo(data.user);
               alert("Profile updated successfully!");
          } catch (err) {
               setError(err.message);
          }
     }

     return (
          <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", textAlign: "center" }}>
               <h2>My Profile</h2>

               {error && <p style={{ color: "red" }}>{error}</p>}

               {/* Profile Picture Upload */}
               <div>
                    <label htmlFor="profilePic">
                         {profilePic ? (
                              <img
                                   src={profilePic instanceof File ? URL.createObjectURL(profilePic) : `http://localhost:5000${profilePic}`}
                                   alt="Profile"
                                   style={{ width: "100px", height: "100px", borderRadius: "50%", cursor: "pointer", objectFit: "cover" }}
                              />
                         ) : (
                              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                   Upload
                              </div>
                         )}
                    </label>
                    <input
                         type="file"
                         id="profilePic"
                         accept="image/*"
                         style={{ display: "none" }}
                         onChange={(e) => setProfilePic(e.target.files[0])}
                    />
               </div>

               {/* User Details Form */}
               <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                    <input
                         type="text"
                         value={username}
                         onChange={(e) => setUsername(e.target.value)}
                         placeholder="Username"
                         required
                         style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />

                    <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="Email"
                         required
                         style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />

                    <input
                         type="date"
                         value={birthdate}
                         onChange={(e) => setBirthdate(e.target.value)}
                         style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />

                    <textarea
                         value={bio}
                         onChange={(e) => setBio(e.target.value)}
                         placeholder="Short Profile Description"
                         rows="3"
                         style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />

                    <button type="submit" style={{ background: "#007bff", color: "#fff", padding: "10px", borderRadius: "5px", cursor: "pointer", border: "none" }}>
                         Save Changes
                    </button>
               </form>
          </div>
     );
}
