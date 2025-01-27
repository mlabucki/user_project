const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

app.get("/r/:param", (req, res) => {
  const { param } = req.params;
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const filteredUsers = data.users.filter(
    (u) =>
      u.name.toLowerCase().includes(param.toLowerCase()) ||
      u.surname.toLowerCase().includes(param.toLowerCase())
  );
  if (filteredUsers.length === 0) {
    return res.render("notfound", { param });
  }
  res.render("users", { filteredUsers, param });
});

app.get("/users/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const user = data.users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).send("No user");
  }
  res.render("user", { user });
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
