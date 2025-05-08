const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { BlogPosts } = require("./BlogPost"); // Đảm bảo file này tồn tại

const app = express();
const jsonParser = bodyParser.json();

// Sử dụng CORS với cấu hình cho phép credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Thêm middleware để đảm bảo CORS khi dùng credentials
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// API login
app.post("/api/login", jsonParser, (req, res) => {
  const { username, password } = req.body;

  // Demo: Kiểm tra đơn giản
  if (username === "admin" && password === "123") {
    res.status(200).send({ message: "Login successful" });
  } else {
    res.status(400).send({ message: "Login failed" });
  }
});

// API tạo post mới
app.post("/api/newpost", jsonParser, (req, res) => {
  const { slug, title, description } = req.body;

  if (!slug || !title || !description) {
    return res.status(400).send({ message: "Missing required fields!" });
  }

  const existing = BlogPosts.find((p) => p.slug === slug);
  if (existing) {
    return res.status(400).send({ message: "Slug already exists." });
  }

  const newPost = { slug, title, description };
  BlogPosts.push(newPost);
  res.status(201).send({ message: "Post created", post: newPost });
});

// API lấy toàn bộ post
app.get("/api/posts", (req, res) => {
  res.status(200).json(BlogPosts);
});

// API lấy post theo slug
app.get("/api/post/:slug", (req, res) => {
  const { slug } = req.params;
  const found = BlogPosts.find((p) => p.slug === slug);

  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
