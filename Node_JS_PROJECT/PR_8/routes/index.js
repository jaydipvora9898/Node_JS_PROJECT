const express = require("express");
const { dashboard, loginUser, logOut, profile, passwordChangeForm, passwordChange, sendOtp, OTPForm, newPassword, verifyOTP, resetPassword, loginPage } = require("../controllers/index");
const userRouter = require("./user.route");
const passport = require("../middleware/local_strategy"); 
const router = express.Router();
const categoryRouter =  require("./category.route");
const subCategoryRouter = require("./subCategory.route");
const extraCategoryRouter = require("./extraCategory.routes");
const productRouter = require("./product.route");
const webRouter = require("./web.route");



router.get("/", loginPage);
router.post("/login-user", passport.authenticate("local", { failureRedirect: "/" }), loginUser);

router.get("/dashboard", passport.checkAuthentication, dashboard);
router.get("/user-logOut", logOut);
router.get("/user-profile", passport.checkAuthentication, profile);
router.get("/user-passwordChange", passport.checkAuthentication, passwordChangeForm);
router.post("/passwordChange", passport.checkAuthentication, passwordChange);

router.post("/sendOtp", sendOtp);
router.get("/OTPForm", OTPForm);
router.get("/resetPasswordForm", newPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);

router.use("/webPage", webRouter)
router.use("/users", userRouter);
router.use("/category", categoryRouter);
router.use("/subCategory", subCategoryRouter);
router.use("/extraCategory", extraCategoryRouter);

router.use("/product", productRouter);
module.exports = router;
