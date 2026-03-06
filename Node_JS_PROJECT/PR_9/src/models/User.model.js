const mongoose =  require("mongoose")

const userSchema =  mongoose.Schema({
    firstname : {
        type :  String
    }, 
    lastname : {
        type : String
    }, 
    email : {
        type :  String
    }, 
    password : {
        type : String
    }, 
    gender : {
        type : String,
        enum : ["Male", "Female"]
    }, 
    profileImg : {
        type :String
    },
    isDelete : {
        type : Boolean,
        default : false
    },
    role : {
       type : String,
       enum : ["admin", "manager", "employee"]
    }
})

const User =  mongoose.model("users", userSchema)

 module.exports = User