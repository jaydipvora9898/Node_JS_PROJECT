const mongoose = require("mongoose")

const extraCategorySchema = new  mongoose.Schema ({
    categoryName :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category"
    }, 
    subCategoryName : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "subCategory"
    },
    extraCategoryName : {
        type  : String
    }
})

const extraCategory =  mongoose.model("extraCategory" ,  extraCategorySchema)
module.exports =  extraCategory;
