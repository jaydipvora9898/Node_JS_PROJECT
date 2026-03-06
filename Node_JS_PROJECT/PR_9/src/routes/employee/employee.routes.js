const express =  require("express")
const { updateEmployee, deleteEmployee } = require("../../controllers/employee/employee.controller")
const { uploadEmployeeImg } = require("../../middleware/multer")
const { verifyToken, verifyRoleToken } = require("../../middleware/jwtToken")
const { register, login } = require("../../controllers/auth.controller")
const { AllProfile, profile } = require("../../controllers/reusable.controller")

const employeeRouter =  express.Router()

employeeRouter.post("/addEmployee",verifyToken,  verifyRoleToken("admin", "manager"),uploadEmployeeImg.single("profileImg"), register )
employeeRouter.post("/employeeLogin",  login("employee"))
employeeRouter.get("/employeeProfile/:id", verifyToken , profile("employee"))
employeeRouter.get("/allEmployees", verifyToken,AllProfile("employee"))

employeeRouter.put("/editEmployee/:id", verifyToken, uploadEmployeeImg.single("profileImg") ,updateEmployee)
employeeRouter.delete("/deleteEmployee/:id", verifyToken, verifyRoleToken("admin", "manager"), deleteEmployee)


module.exports = employeeRouter