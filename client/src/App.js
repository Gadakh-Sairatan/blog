import './App.css';
import { BrowserRouter } from "react-router-dom";  // ✅ Wrap Routes inside BrowserRouter
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/Indexpage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/SignUp";
import CreatePost from './pages/CreatePost';
import PostPage from './pages/post';
import EditPost from './pages/EditPost';
import Layout from './pages/layout';
import { UserContextProvider } from './Components/UserContext';
import DeletePost from './pages/DeletePost';
import MyBlogs from './pages/MyBlogs';
import Profile from './pages/Profile';

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>  
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/delete/:id" element={<DeletePost/>} />
            <Route path="/my-blogs" element={<MyBlogs/>}/>
            <Route path="/profile" element={<Profile/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
