const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Load posts from a file
let posts = require("./posts.json");

// Routes
app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/new", (req, res) => {
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
  };
  posts.push(newPost);
  fs.writeFileSync("./posts.json", JSON.stringify(posts, null, 2));
  res.redirect("/");
});

app.get("/post/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  res.render("post", { post });
});

app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  const postIndex = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (postIndex !== -1) {
    posts[postIndex] = {
      ...posts[postIndex],
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
    };
    fs.writeFileSync("./posts.json", JSON.stringify(posts, null, 2));
  }
  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  posts = posts.filter((p) => p.id !== parseInt(req.params.id));
  fs.writeFileSync("./posts.json", JSON.stringify(posts, null, 2));
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
