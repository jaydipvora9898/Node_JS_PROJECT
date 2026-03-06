const User = require("../../models/User.model")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")


exports.updateManager = async (req, res) => {
    try {
        const user = req.user;
        const managerId = req.params.id ;

        let manager = await User.findById(managerId);
        if (!manager || manager.isDelete) {
            return res.json({ status: 404, message: "Manager Not Found" });
        }

        if (user.role === "manager" && user._id.toString() !== managerId.toString()) {
            return res.json({ status: 403, message: "Manager cannot update other managers!" });
        }

        let imagePath = manager.profileImg;
        if (req.file) {
            let oldImagePath = path.join(__dirname, "../..", imagePath || "");
            if(manager.profileImg && fs.existsSync(oldImagePath)){
                fs.unlinkSync(oldImagePath)
            }
            imagePath = `/uploads/manager_profile/${req.file.filename}`;
        }

        let updatedData = { ...req.body, profileImg: imagePath, isDelete: false };

        if (user.role === "manager") delete updatedData.role;

        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 12);
        }

        manager = await User.findByIdAndUpdate(managerId, updatedData, { new: true });
        return res.json({ status: 200, message: "Manager updated successfully!", data: manager });
    } catch (error) {
        return res.json({ status: 500, message: "Server Error" });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        const user = req.user;
        const managerId = req.params.id;

        if (user.role !== "admin") {
            return res.json({ status: 403, message: "Only admin can delete managers!" });
        }

        const manager = await User.findById(managerId);
        if (!manager || manager.isDelete) {
            return res.json({ status: 404, message: "Manager Not Found" });
        }

        await User.findByIdAndUpdate(managerId, { isDelete: true });
        return res.json({ status: 200, message: "Manager deleted successfully!" });
    } catch (error) {
        return res.json({ status: 500, message: "Server Error" });
    }
};
