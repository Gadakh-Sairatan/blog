require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

// ✅ Fix 1: Improved CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// ✅ Fix 2: Secure File Upload
const uploadMiddleware = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  }
});

// ✅ Fix 3: MongoDB Connection with Better Error Handling
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
}
connectDB();

const JWT_SECRET = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

// ✅ User Authentication Endpoints

// 🛠️ Register User
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// 🔑 Login User
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) return res.status(400).json({ error: 'User not found' });

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, JWT_SECRET, {}, (err, token) => {
      if (err) return res.status(500).json({ error: 'Error signing token' });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' }).json({ id: userDoc._id, username });
    });
  } else {
    res.status(400).json({ error: 'Wrong credentials' });
  }
});

// 🆔 Get Profile
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, {}, (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    res.json(info);
  });
});

// 🚪 Logout User
app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json({ message: 'Logged out' });
});

// ✅ Blog Post Endpoints

// ✍️ Create Post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, JWT_SECRET, {}, async (err, info) => {
      if (err) return res.status(403).json({ error: 'Unauthorized' });

      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    res.status(500).json({ error: 'Post creation failed' });
  }
});

// ✏️ Update Post
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const ext = originalname.split('.').pop();
        newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
      }
  
      const { token } = req.cookies;
      jwt.verify(token, JWT_SECRET, {}, async (err, info) => {
        if (err) return res.status(403).json({ error: 'Unauthorized' });
  
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        if (!postDoc) return res.status(404).json({ error: 'Post not found' });
  
        if (String(postDoc.author) !== String(info.id)) {
          return res.status(403).json({ error: 'You are not the author' });
        }
  
        await Post.findByIdAndUpdate(id, {
          title,
          summary,
          content,
          cover: newPath ? newPath : postDoc.cover,
        }, { new: true });
  
        res.json({ message: 'Post updated successfully' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  });


// 📜 Get All Posts
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 📖 Get Single Post
app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    if (!postDoc) return res.status(404).json({ error: 'Post not found' });

    res.json(postDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

app.get("/my-blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userPosts = await Post.find({ author: id }).populate("author", ["username"]);

    if (userPosts.length === 0) {
      return res.json([]); // Return an empty array if no posts exist
    }

    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ❌ DELETE POST (NEWLY ADDED)
app.delete('/post/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
