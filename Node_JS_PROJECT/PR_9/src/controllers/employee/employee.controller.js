const User = require("../../models/User.model")
const bcrypt =  require("bcrypt")
const path =  require("path")
const fs =  require("fs")


exports.updateEmployee = async (req, res) => {
    try {
      const user = req.user;
      const employeeId = req.params.id;
  
      let employee = await User.findById(employeeId);
      if (!employee) {
        return res.json({ status: 404, message: "Employee Not Found" });
      }
  
      if (user.role === "employee" && user._id.toString() !== employeeId.toString()) {
        return res.json({ status: 403, message: "Employee cannot edit others" });
      }
  
      let imagePath = employee.profileImg;
      if (req.file) {
        const oldImagePath = path.join(__dirname, "../..", imagePath || "");
        if (employee.profileImg && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        imagePath = `/uploads/employee_profile/${req.file.filename}`;
      }
  
      let updatedData = { ...req.body, profileImg: imagePath, isDelete: false };
  
      if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 12);
      }
  
      if (user.role === "employee" || user.role === "manager") {
        delete updatedData.role;
      }
  
      employee = await User.findByIdAndUpdate(employeeId, updatedData, { new: true });
  
      return res.json({ status: 200, message: "Employee Updated successfully!", data: employee });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Server Error" });
    }
  };
  



exports.deleteEmployee =  async (req, res) => {
   try {
    let user = req.user
    const employeeId =  req.params.id

    if(user.role !== "admin" && user.role !== "manager"){
        return  json({status :400 , message : " only Admin or manager can delete"})
    }

    let employee =  await User.findById(employeeId)

    if(!employee){
        return res.json({status :  404, message : "Employee Not Found"})
    }

    employee = await User.findByIdAndUpdate(employeeId,  {isDelete: true })
   return res.json({status : 200, message : "Employee Deleted successfully"})
   } catch (error) {
    console.log(error);
    return res.json({status : 500, message :"erver Error"})
   }

}

