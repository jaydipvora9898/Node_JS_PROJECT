const express =  require("express")
const {  updateManager , managerProfile, deleteManager, allManagers} = require("../../controllers/manager/manager.controller")
const { uploadManagerImg } = require("../../middleware/multer")
const {verifyToken,verifyRoleToken } = require("../../middleware/jwtToken")
const { register, login } = require("../../controllers/auth.controller")
const { AllProfile, profile } = require("../../controllers/reusable.controller")

const managerRouter =  express.Router()

managerRouter.post("/addManagers",verifyToken,verifyRoleToken("admin"),  uploadManagerImg.single("profileImg"),register)
managerRouter.post("/managerLogin",  login("manager"))  

managerRouter.put("/editManager/:id", verifyToken,verifyRoleToken("admin", "manager"),uploadManagerImg.single("profileImg"), updateManager)
managerRouter.get("/managerProfile/:id",verifyToken, profile("manager"))
managerRouter.delete("/deleteManager/:id",verifyToken,verifyRoleToken("admin"), deleteManager)
managerRouter.get("/allManagers" ,verifyToken, AllProfile("manager"))

module.exports = managerRouter