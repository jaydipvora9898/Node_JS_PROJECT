const express = require("express");
const path = require("path");
const DB_connection = require("./config/DB_connection");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("./middleware/local_strategy");
const mongoStore =  require("connect-mongo")

const app = express();
const port = 8088;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    name: "testing",
    secret: "hello",
    saveUninitialized: false,
    resave: false,
    store :  mongoStore.create({
      mongoUrl:  "mongodb+srv://yogeshrd1708:yogesh17RD@cluster0.8rdbura.mongodb.net/", 
      collectionName : "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAutheticatUser);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


(async () => {
  await DB_connection();
  app.use("/", router);
  app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
  });
})();
