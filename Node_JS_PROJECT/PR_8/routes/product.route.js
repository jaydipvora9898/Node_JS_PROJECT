const express =  require("express")
const { addProductForm, addProduct, viewProduct, editProductForm, singleProduct, editProduct, deleteProduct } = require("../controllers/product.controller")
const uploadImg = require("../middleware/multer_user")


const productRouter = express.Router()

productRouter.get("/add-product", addProductForm)
productRouter.post("/add-product", uploadImg.single("productImage"), addProduct)
productRouter.get("/view-product", viewProduct)
productRouter.get("/edit-product/:id", editProductForm)
productRouter.get("/single-product/:id", singleProduct)
productRouter.post("/edit-product/:id", uploadImg.single("productImage"), editProduct)
productRouter.get("/delete-product/:id", deleteProduct)

module.exports =   productRouter
