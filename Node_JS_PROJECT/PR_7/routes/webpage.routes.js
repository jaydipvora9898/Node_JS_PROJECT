const express = require("express");
const { webPage, singleBlog, addComment, registerPage, registerUser, userLoginPage, userLogin } = require("../controllers/web.controller");

const WebRouter = express.Router();

WebRouter.get("/home", webPage);
WebRouter.get("/home/single-blog/:id", singleBlog);
WebRouter.post("/home/single-blog/:id/comment", addComment);
WebRouter.get("/registerPage", registerPage);
WebRouter.post("/registerUser", registerUser);
WebRouter.get("/userLogin", userLoginPage);
WebRouter.post("/userLogin", userLogin);

WebRouter.get("/logoutUser", (req, res) => {
    req.session.destroy();
    res.redirect("/webPage/home");
  });
  

module.exports = WebRouter;
