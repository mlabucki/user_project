const express = require("express");
const port = 3000;

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
