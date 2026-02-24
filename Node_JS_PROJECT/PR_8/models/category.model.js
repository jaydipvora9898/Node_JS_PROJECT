const mongoose =  require("mongoose")

const categorySchema =  mongoose.Schema ({
     categoryName : {
        type : String
     }, 
     categoryImage : {
        type :  String
     }
})

const Category =  mongoose.model("category" , categorySchema)
module.exports = Category