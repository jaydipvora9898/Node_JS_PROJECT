const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return res.json({status : 401, message: "Authorization Missing" });
        }

        const token = authorization.split(" ")[1];
        if (!token) {
            return res.json({ status :  400,  message: "Token Missing" });
        }

        const {userId} = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ status: 401, message: "Invalid User Token" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error("Token verification error:", error);
        return res.json({ status: 403, message: "Invalid or Expired Token" });
    }
};

 exports.verifyRoleToken = (...roles) => {
        return (req, res, next) => {
            if(roles.includes(req.user.role)){
                next();
            }
            else{
                return res.json({message: "Invalid Role"});
            }
        }
 }
  

