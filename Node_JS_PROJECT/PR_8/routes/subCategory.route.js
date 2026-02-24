const express =  require("express");
const uploadImg = require("../middleware/multer_user");
const { addSubCategoryForm, addSubCategory, viewSubCategory, editSubCategoryForm, deleteSubCategory, editSubCategory, allSubCategory } = require("../controllers/subCategory.controller");


const subCategoryRouter = express.Router();

subCategoryRouter.get("/add-subCategory", addSubCategoryForm)
subCategoryRouter.post("/add-subCategory", addSubCategory)
subCategoryRouter.get("/view-subCategory", viewSubCategory)
subCategoryRouter.get("/edit-subCategory/:id", editSubCategoryForm)
subCategoryRouter.post("/edit-subCategory/:id", editSubCategory)
subCategoryRouter.get("/delete-subCategory/:id", deleteSubCategory)


subCategoryRouter.get("/getAllSubCategory", allSubCategory) 



module.exports  =  subCategoryRouter;