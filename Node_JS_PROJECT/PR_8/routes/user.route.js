const express = require("express");
const { AddUser, AllUser , AddUserForm , EditUser, EditUserForm, DeleteUser} = require("../controllers/user.controller");
const uploadImg = require("../middleware/multer_user");



const userRouter = express.Router();

userRouter.get("/add-user", AddUserForm);
userRouter.post("/add-user" ,uploadImg.single("image"), AddUser);
userRouter.get("/all-user", AllUser);
userRouter.post("/edit-user/:id",uploadImg.single("image"), EditUser)
userRouter.get("/edit-user/:id", EditUserForm);
userRouter.get("/delete-user/:id", DeleteUser);

module.exports = userRouter;
