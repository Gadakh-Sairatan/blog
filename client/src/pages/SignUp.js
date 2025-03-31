import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const navigate = useNavigate();  // Initialize useNavigate

     async function register(ev) {
          ev.preventDefault();
          const response = await fetch('http://localhost:5000/register', {
               method: 'POST',
               body: JSON.stringify({ username, password }),
               headers: { 'Content-Type': 'application/json' },
          });

          if (response.status === 200) {
               alert('Registration successful');
               navigate('/login');  // Redirect to login page
          } else {
               alert('Registration failed');
          }
     }

     return (
          <form className="register" onSubmit={register}>
               <h1>Sign Up</h1>
               <input type="text"
                    placeholder="username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)} />
               <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
               <button>Sign Up</button>
          </form>
     );
}
