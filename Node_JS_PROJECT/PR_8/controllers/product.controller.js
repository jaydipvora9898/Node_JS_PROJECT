const Category = require("../models/category.model")
const subCategory = require("../models/subCategory.model")
const extraCategory =  require("../models/extraCategory.model")
const Product = require("../models/product.model");



exports.addProductForm = async (req, res) => {
    try {
        const categories = await Category.find();
        const subCategories = await subCategory.find();
        const extraCategories = await extraCategory.find();  
        res.render("Product/addProduct", { categories, subCategories, extraCategories });
    } catch (error) {
        console.log("Add Product Page Error", error);
    }
};


exports.addProduct = async (req, res) => {
    try {
        const image = req.file ? '/uploads/' + req.file.filename : "";
        await Product.create({ ...req.body, productImage: image
        });
        res.redirect("/product/add-product");
    } catch (error) {
        console.error("Error adding product:", error);
    }
};


exports.viewProduct = async (req, res) => {
    try {
        const products = await Product.find().populate("categoryName").populate("subCategoryName").populate("extraCategoryName");
        res.render("Product/viewProduct", { products });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};


exports.editProductForm = async (req, res) => {
    try {
        const categories = await Category.find();
        const subCategories = await subCategory.find();
        const extraCategories = await extraCategory.find();
        const product = await Product.findById(req.params.id).populate('categoryName').populate('subCategoryName').populate('extraCategoryName');
        return res.render("Product/editProduct", {product, categories, subCategories, extraCategories  });
    } catch (error) {
        console.error("Edit Product Page Load Error:", error);
    }
};


exports.singleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryName').populate('subCategoryName').populate('extraCategoryName');
        res.render('Product/singleProduct', { product });
    } catch (error) {
        console.error("View Product Page Load Error:", error);
        res.redirect('/product/view-product');
    }
};


exports.editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            console.error('Product not found');
            return res.redirect('/product/all-product');
        }
        const image = req.file ? '/uploads/' + req.file.filename : product.productImage;
        await Product.findByIdAndUpdate(id, {...req.body, productImage: image
        });
        return res.redirect('/product/view-product');
    } catch (error) {
        console.error('Error updating product:', error);
    }
};


exports.deleteProduct =  async (req, res) => {
     try {
        await Product.findByIdAndDelete(req.params.id)
        return res.redirect("product/view-product")
     } catch (error) {
         console.log("Delete Product Error " , error);
     }
}