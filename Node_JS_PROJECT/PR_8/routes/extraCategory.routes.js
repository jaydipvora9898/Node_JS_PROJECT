const express =  require("express");
const { extraCategoryForm, viewExtraCategory, addExtraCategory, editExtraCategoryForm , editExtraCategory, deleteExtraCategory} = require("../controllers/extraCategory.controller");


const extraCategoryRouter = express.Router();

extraCategoryRouter.get("/add-extraCategory", extraCategoryForm)
extraCategoryRouter.post("/add-extraCategory", addExtraCategory)
extraCategoryRouter.get("/view-extraCategory", viewExtraCategory)
extraCategoryRouter.get("/edit-extraCategory/:id", editExtraCategoryForm)
extraCategoryRouter.get("/delete-extraCategory/:id", deleteExtraCategory)
extraCategoryRouter.post("/edit-extraCategory/:id", editExtraCategory)

module.exports  =  extraCategoryRouter;