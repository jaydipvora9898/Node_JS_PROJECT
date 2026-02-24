const mongoose =  require("mongoose")

const ProductSchema =  new mongoose.Schema({
 productTitle :  {
   type :  String
 },
 productDesc :  {
   type :  String
 },
 productPrice: {
  type: Number,
  required: true
},
 productImage :  {
   type :  String
 },
 categoryName :  {
    type : mongoose.Schema.Types.ObjectId,
    ref : "category"
}, 
subCategoryName : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "subCategory"
},
extraCategoryName : {
    type  : mongoose.Schema.Types.ObjectId,
    ref : "extraCategory"
},
productDescount : {
  type : Number ,
}

})

const Product = mongoose.model("Product" ,  ProductSchema)
module.exports =  Product;