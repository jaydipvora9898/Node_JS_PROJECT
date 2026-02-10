
const express = require("express");
const path = require("path");
const DB_connection = require("./config/DB_connection");
const router = require("./routes");
const cookieParser =  require("cookie-parser")

const app = express();
const port = 8088;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

(async () => {
    await DB_connection(); 

    app.use("/", router);

    app.listen(port, () => {
        console.log(`Server Running on http://localhost:${port}`);
    });
})();
