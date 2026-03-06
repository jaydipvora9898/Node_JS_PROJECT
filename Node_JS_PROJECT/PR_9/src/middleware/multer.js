    const multer =  require("multer")

    const adminStorage = multer.diskStorage({
        destination : (req, res, cb) => {
            cb(null, "src/uploads/admin_profile")
        },

        filename : (req, res, cb) => {
            cb(null, `IMG-${Date.now()}`)
        }
    })

    const uploadAdminImg = multer({storage : adminStorage})


    const managerStorage = multer.diskStorage({
        destination : (req, res, cb) => {
            cb(null, "src/uploads/manager_profile")
        },

        filename : (req, res, cb) => {
            cb(null, `IMG-${Date.now()}`)
        }
    })

    const uploadManagerImg = multer({storage : managerStorage})


    const employeeStorage = multer.diskStorage({
        destination : (req, res, cb) => {
            cb(null, "src/uploads/employee_profile")
        },

        filename : (req, res, cb) => {
            cb(null, `IMG-${Date.now()}`)
        }
    })

    const uploadEmployeeImg = multer({storage : employeeStorage})


    module.exports = {uploadAdminImg, uploadManagerImg, uploadEmployeeImg}
   