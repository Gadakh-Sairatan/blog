import { useContext, useState } from "react";
import { Navigate,Link } from "react-router-dom";
import { UserContext } from "../Components/UserContext";
import "../styles/styles.css";


export default function LoginPage() {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [redirect, setRedirect] = useState(false);
     const { setUserInfo } = useContext(UserContext);
     async function login(ev) {
          ev.preventDefault();
          const response = await fetch('http://localhost:5000/login', {
               method: 'POST',
               body: JSON.stringify({ username, password }),
               headers: { 'Content-Type': 'application/json' },
               credentials: 'include',
          });
          if (response.ok) {
               response.json().then(userInfo => {
                    setUserInfo(userInfo);
                    setRedirect(true);
               });
          } else {
               alert('wrong credentials');
          }
     }

     if (redirect) {
          return <Navigate to={'/'} />
     }
     return (
          <form className="login" onSubmit={login}>
               <h1>Sign In</h1>
               <input type="text"
                    placeholder="username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)} />
               <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
               <button>Sign In</button>
               <p>Don't have an account? <Link to="/register"><b>Sign Up</b></Link></p>
          </form>
     );
}


