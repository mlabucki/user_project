const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const expressLayouts = require("express-ejs-layouts");
app.use(express.static("public"));
app.use(expressLayouts);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

//home for sign in sign out
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

//search for login

app.get("/users", (req, res) => {
  const { param } = req.query; // Use req.query to get the query parameter
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

//detail for user
app.get("/users/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const user = data.users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).send("No user");
  }

  res.render("user", {
    user,
    title: "User page",
  });
});

app.post("/users", (req, res) => {
  const { name, surname } = req.body;
  res.send(`${name}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
