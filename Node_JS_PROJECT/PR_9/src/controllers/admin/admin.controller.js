const User = require("../../models/User.model");

exports.editAdminProfile = async (req, res) => {
    try {
      let user = req.user;
      const adminId = req.params.id;
  
      let admin = await User.findById(adminId);
      if (!admin) {
        return res.json({ status: 404, message: "Admin Not Found !" });
      }
  
      if (user.role === "manager" && user._id.toString() !== adminId.toString()) {
        return res.json({ status: 403, message: "Manager cannot edit admins!" });
      }
  
      let imagePath = admin.profileImg;
      if (req.file) {
        const oldImagePath = path.join(__dirname, "../..", imagePath || "");
        if (admin.profileImg && fs.existsSync(oldImagePath)) 
        fs.unlinkSync(oldImagePath);
        imagePath = `/uploads/admin_profile/${req.file.filename}`;
      }
  
      let updatedData = { ...req.body, profileImg: imagePath, isDelete: false };
      if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 12);
      }
  
      admin = await User.findByIdAndUpdate(adminId, updatedData, { new: true });
      return res.json({ status: 200, message: "Admin updated successfully!", data: admin });
    } catch (error) {
      return res.json({ status: 500, message: "Server Error" });
    }
  };
  