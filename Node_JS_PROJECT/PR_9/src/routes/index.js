const express =  require("express")
const managerRouter = require("./manager/manager.routes")
const employeeRouter = require("./employee/employee.routes")
const authRouter = require("./admin/admin.routes")

const router =  express.Router()

router.use("/admin", authRouter)
router.use("/manager", managerRouter)
router.use("/employee", employeeRouter)

module.exports =  router