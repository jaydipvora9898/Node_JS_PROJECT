const express = require("express");
const { dashboard, Blogs, loginUser, logOut, profile, passwordChangeForm, passwordChange, myBlog, sendOtp, OTPForm, newPassword, verifyOTP, resetPassword, loginPage } = require("../controllers/index");
const userRrouter = require("./user.route");
const blogRrouter = require("./blog.route");
const passport = require("../middleware/local_strategy"); 
const WebRrouter = require("./webpage.routes");
const router = express.Router();

router.get("/", loginPage);
router.post("/login-user", passport.authenticate("local", { failureRedirect: "/" }), loginUser);

router.get("/dashboard", passport.checkAuthentication, dashboard);
router.get("/user-logOut", logOut);
router.get("/user-profile", passport.checkAuthentication, profile);
router.get("/user-passwordChange", passport.checkAuthentication, passwordChangeForm);
router.post("/passwordChange", passport.checkAuthentication, passwordChange);
router.get("/my-blog/category/:category", passport.checkAuthentication, myBlog);

router.post("/sendOtp", sendOtp);
router.get("/OTPForm", OTPForm);
router.get("/resetPasswordForm", newPassword);
router.post("/verifyOTP", verifyOTP);



router.post("/resetPassword", resetPassword);

router.use("/users", userRrouter);
router.use("/blogs", blogRrouter);
router.use("/webPage", WebRrouter);

module.exports = router;
