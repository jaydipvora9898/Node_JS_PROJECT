const Category = require("../models/category.model")
const extraCategory = require("../models/extraCategory.model")
const Product = require("../models/product.model")
const subCategory = require("../models/subCategory.model")



exports.extraCategoryForm = async (req, res) => {
    const categories = await Category.find()
    const subCategories = await subCategory.find()
    res.render("extraCategory/addExtraCategory", { categories, subCategories })
}


exports.addExtraCategory = async (req, res) => {
    try {
        let extraCatExist = await extraCategory.findOne({
            extraCategoryName: req.body.extraCategoryName, subCategoryName: req.body.subCategoryName, categoryName: req.body.categoryName
        });
        if (extraCatExist) {
            req.flash('error', 'Subcategory already exists for this category');
            return res.redirect("/subCategory/add-subCategory");
        }
        const extraCategories = await extraCategory.create(req.body);
        console.log(req.body);
        req.flash('success', 'Extra Category added successfully');
        console.log("ExtraCategory created successfully");
        res.redirect("view-extraCategory");
    } catch (error) {
        console.log("Add Sub Category Error", error);
    }
}


exports.viewExtraCategory = async (req, res) => {
    try {
        const extraCategories = await extraCategory.find().populate({ path: "subCategoryName", populate: { path: "categoryName" } });
        return res.render("extraCategory/viewExtraCategory", { extraCategories })
    } catch (error) {
        console.log("View Extra Category Error", error);
    }
}


exports.editExtraCategoryForm = async (req, res) => {
    try {
        const categories = await Category.find();
        const subCategories = await subCategory.find();
        const extraCategories = await extraCategory.findById(req.params.id).populate({ path: "subCategoryName", populate: { path: "categoryName" } });
        return res.render("extraCategory/editExtraCategory", { extraCategories, subCategories, categories });
    } catch (error) {
        console.log("Edit Extra Category Page Load Error:", error);
    }
};


exports.editExtraCategory = async (req, res) => {
    try {
        await extraCategory.findByIdAndUpdate(req.params.id, { ...req.body })
        return res.redirect("view-extraCategory")
    } catch (error) {
        console.log("Edit Extra Category Error ", error);
    }
}


exports.deleteExtraCategory = async (req, res) => {
    try {
        let extraRecord = await extraCategory.findById(req.params.id)
        await extraCategory.findByIdAndDelete(req.params.id)
        await Product.deleteMany({ extraCategoryName: extraRecord._id })
        return res.redirect("view-extraCategory")
    } catch (error) {
        console.log("Delete Extra Category Error", error);
    }
}