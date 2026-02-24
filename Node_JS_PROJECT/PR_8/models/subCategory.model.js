const mongoose = require("mongoose")

const subCategorySchema = new  mongoose.Schema ({
    categoryName :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category"
    }, 
    subCategoryName : {
        type  : String
    }
})

const subCategory =  mongoose.model("subCategory" ,  subCategorySchema)
module.exports =  subCategory;
