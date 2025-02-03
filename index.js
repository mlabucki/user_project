const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session"); // Import express-session
const app = express();
const port = 3000;

const expressLayouts = require("express-ejs-layouts");
app.use(express.static("public"));
app.use(expressLayouts);

// Middleware to parse URL-encoded data (for POST requests)
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: "your-secret-key", // Use a secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if you're using HTTPS
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

// Home route
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    isAuthenticated: req.session.isAuthenticated || false,
    email: req.session.email || "",
  });
});

// Login route (GET)
app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Login route (POST)
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

  // Simulate a login check (in a real app, you'd check against a database)
  const user = data.users.find(
    (u) => u.password === password && u.email === email
  );

  if (user) {
    // Successful login
    req.session.isAuthenticated = true;
    req.session.email = email;
    return res.redirect("/");
  } else {
    // Failed login
    return res.render("login", {
      title: "Login",
      error: "Invalid credentials",
    });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to logout.");
    }
    res.redirect("/"); // Redirect to home after logout
  });
});

// Search route
app.get("/users", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }

  const { param } = req.query;
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  if (!param) {
    return res.render("users", {
      filteredUsers: data.users,
      param: "",
      title: "All Users",
    });
  }
  const filteredUsers = data.users.filter(
    (u) =>
      u.name.toLowerCase().includes(param.toLowerCase()) ||
      u.surname.toLowerCase().includes(param.toLowerCase())
  );
  if (filteredUsers.length === 0) {
    return res.render("notfound", { param });
  }
  res.render("users", { filteredUsers, param, title: "Search Results" });
});

// User detail route
app.get("/users/:id", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }

  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const user = data.users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).send("No user found"); // Corrected to use res.status() method properly
  }

  res.render("user", {
    user,
    title: "User page",
  });
});

// Handle POST requests for new user data
app.post("/users", (req, res) => {
  const { name, surname } = req.body;
  res.send(`User name: ${name}, Surname: ${surname}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
