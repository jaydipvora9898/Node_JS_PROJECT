const User = require("../models/User.model");

exports.profile = (role) => async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    const user = await User.findOne({ _id: userId, role, isDelete: false });
    if (!user) {
      return res.json({ status: 404, message: `${role} not found` });
    }

    return res.json({ status: 200, message: `View ${role} profile`, data: user});
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, message: "Server Error" });
  }
};

exports.AllProfile = (role) => async (req, res) => {
  try {
    const users = await User.find({ role, isDelete: false });
    return res.json({ status: 200,message: `View all ${role}s`,data: users});
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, message: "Server Error" });
  }
};
