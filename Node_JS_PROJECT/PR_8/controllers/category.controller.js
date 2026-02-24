const Category = require("../models/category.model");
const path = require("path")
const fs = require("fs");
const subCategory = require("../models/subCategory.model");
const extraCategory = require("../models/extraCategory.model");
const Product = require("../models/product.model");



exports.addCategoryForm = (req, res) => {
    res.render("Category/addCategory")
}


exports.addCategory = async (req, res) => {
    try {
        const image = req.file ? '/uploads/' + req.file.filename : "";
        const categories = await Category.create({ ...req.body, categoryImage: image })
        console.log(categories);
        return res.redirect("/category/view-category")
    } catch (error) {
        console.error("Error adding Category:", error);
    }
}


exports.viewCategory = async (req, res) => {
    try {
        const categories = await Category.find()
        res.render("Category/category_data", { categories })
    } catch (error) {
        console.log("View Category Error", error);
    }
}


exports.editCategoryForm = async (req, res) => {
    try {
        let id = req.params.id
        const categories = await Category.find()
        const category = await Category.findById(id)
        res.render("Category/editCategory", { category, categories })
    } catch (error) {
        console.table("Edit Category Form", error);
    }
}


exports.editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id)
        if (!category) {
            return res.redirect("back");
        }
        let imagePath = category.categoryImage;
        if (req.file) {
            const oldImagePath = path.join(__dirname, "..", category.categoryImage);
            if (oldImagePath != "") {
                fs.unlinkSync(oldImagePath);
            }
            imagePath = `/uploads/${req.file.filename}`;
        }
        await Category.findByIdAndUpdate(id, { ...req.body, categoryImage: imagePath }, { new: true });
        res.redirect("/category/view-category");
    } catch (error) {
        console.log("Edit Category Error", error);
    }
}


exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id
        const record = await Category.findById(id)
        const subRecord = await subCategory.findById(id)
        if (record?.categoryImage) {
            let imagePath = path.join(__dirname, "..", record.categoryImage)
            if (imagePath = ! " ") {
                fs.unlinkSync(imagePath)
            }
        }
        await Category.findByIdAndDelete(id)
        await subCategory.deleteMany({ categoryName: record._id, })
        await extraCategory.deleteMany({ categoryName: record._id, })
        await Product.deleteMany({ categoryName: record._id, })
        return res.redirect("/category/view-category")
    } catch (error) {
        console.log("Delete Category Error", error);
    }
}