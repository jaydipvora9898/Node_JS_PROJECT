const express = require("express");
const DB_connection = require("./config/mongoDB_connection");
const movieRouter = require("./routes/movie_route")
const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/", movieRouter)

app.listen(port, () => {
  DB_connection();
  console.log(`Server running on http://localhost:${port}`);
});
