const express =  require("express")
const { verifyToken , verifyRoleToken}= require("../../middleware/jwtToken")
const { uploadAdminImg } = require("../../middleware/multer")
const { register, login } = require("../../controllers/auth.controller")
const { profile, AllProfile } = require("../../controllers/reusable.controller")
const { editAdminProfile } = require("../../controllers/admin/admin.controller")

const authRouter = express.Router()

authRouter.post("/register", uploadAdminImg.single("profileImg"), register)
authRouter.post("/login",  login("admin"))
authRouter.get("/myProfile",verifyToken, profile("admin"))
authRouter.put("/editProfile/:id", verifyToken, verifyRoleToken("admin"),uploadAdminImg.single("profileImg"), editAdminProfile)
authRouter.get("/allAdminProfile",verifyToken, AllProfile("admin")), 

module.exports =  authRouter