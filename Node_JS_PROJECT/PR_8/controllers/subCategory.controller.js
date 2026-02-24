const Category = require("../models/category.model")
const extraCategory = require("../models/extraCategory.model")
const Product = require("../models/product.model")
const subCategory = require("../models/subCategory.model")



exports.addSubCategoryForm = async (req, res) => {
    const categories = await Category.find()
    res.render("subCategory/addSubCategory", { categories })
}


exports.addSubCategory = async (req, res) => {
    try {
        let subCatExist = await subCategory.findOne({
            subCategoryName: req.body.subCategoryName, categoryName: req.body.categoryName
        });
        if (subCatExist) {
            req.flash('error', 'Subcategory already exists for this category');
            return res.redirect("/subCategory/add-subCategory");
        }
        const subCategories = await subCategory.create(req.body);
        console.log(req.body);
        req.flash('success', 'Subcategory added successfully');
        console.log("SubCategory created successfully");
        res.redirect("/subCategory/view-subCategory");
    } catch (error) {
        console.log("Add Sub Category Error", error);
    }
}


exports.viewSubCategory = async (req, res) => {
    try {
        const subCategories = await subCategory.find().populate({ path: "categoryName" })
        console.log(subCategories)
        return res.render("subCategory/viewSubCategory", { subCategories })
    } catch (error) {
        console.log("View Sub Category Error", error);
    }
}


exports.editSubCategoryForm = async (req, res) => {
    try {
        const categories = await Category.find();
        const subCategories = await subCategory.findById(req.params.id);
        return res.render("subCategory/editSubCategory", { categories, subCategories });
    } catch (error) {
        console.log("Edit Sub Category Error:", error);
    }
};


exports.deleteSubCategory = async (req, res) => {
    try {
        let subRecord = await subCategory.findById(req.params.id)
        await subCategory.findByIdAndDelete(req.params.id)
        await extraCategory.deleteMany({ subCategoryName: subRecord._id })
        await Product.deleteMany({ subCategoryName: subRecord._id })
        return res.redirect("view-subCategory")
    } catch (error) {
        console.log("Delete Sub Category Error", error);
    }
}


exports.editSubCategory = async (req, res) => {
    try {
        await subCategory.findByIdAndUpdate(req.params.id, { ...req.body })
        return res.redirect("view-subCategory")
    } catch (error) {
        console.log("Edit Sub Category Error", error);
    }
}

exports.allSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.query;
        if (!categoryId) {
            return res.json({ subCategories: [] });
        }

        const subCategories = await subCategory.find({ categoryName: categoryId });
        res.json({ subCategories });
    } catch (err) {
        console.error("Error fetching subcategories:", err);
        res.status(500).json({ error: "Failed to fetch subcategories" });
    }
};