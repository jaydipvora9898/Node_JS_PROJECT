 const express =  require("express");
const { addCategoryForm, addCategory, viewCategory, editCategoryForm, editCategory, deleteCategory } = require("../controllers/category.controller");
const uploadImg = require("../middleware/multer_user");


const categoryRouter = express.Router();

categoryRouter.get("/add-category", addCategoryForm)
categoryRouter.post("/add-category",uploadImg.single("categoryImage") ,  addCategory)
categoryRouter.get("/view-category", viewCategory)
categoryRouter.get("/edit-category/:id", editCategoryForm)
categoryRouter.post("/edit-category/:id",uploadImg.single("categoryImage"), editCategory)
categoryRouter.get("/delete-category/:id", deleteCategory)

module.exports  =  categoryRouter;