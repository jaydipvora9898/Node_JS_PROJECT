const Category = require("../models/category.model")
const Product = require("../models/product.model")
const productUser = require("../models/productUser.model")
const Cart = require("../models/cart.model")
const Order = require('../models/order.model');



exports.userLoginPage = (req, res) => {
    res.render("Website/userLogin");
};


exports.userLogin = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        const user = await productUser.findOne({ userEmail, userPassword });
        if (!user) {
            return res.render("Website/userLogin");
        }
        req.session.user = { id: user._id, firstName: user.userFirstName, lastName: user.userLastName, email: user.userEmail };
        res.redirect("/webPage/home");
    } catch (err) {
        console.error("Error in userLogin:", err);
    }
};


exports.registerPage = (req, res) => {
    res.render("Website/signUp");
};


exports.registerUser = async (req, res) => {
    try {
        const {userEmail}  =  req.body
        const existingUser = await productUser.findOne({ userEmail: userEmail });
        if (existingUser) {
            req, flash("error", "User Already Exist !!!")
            res.render("Website/signUp");
        }
        const newUser = new productUser({ ...req.body });
        await newUser.save();
        res.render("Website/userLogin");
    } catch (err) {
        console.error("Error in registerUser:", err);
    }
};


exports.logoutUser = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).send("Failed to logout");
        }
        res.clearCookie("connect.sid");
        return res.redirect("/webPage/home");
    });
};



exports.homePage = async (req, res) => {
    try {
        const products = await Product.find().populate('categoryName');
        const categories = await Category.find();
        let cartCount = 0;
        if (req.session.user) {
            const cart = await Cart.findOne({ user: req.session.user.id });
            cartCount = cart ? cart.items.length : 0;
        }
        res.render('Website/home', { products, categories, session: req.session, cartCount });

    } catch (error) {
        console.error('Home Page Error:', error);
        res.status(500).send('Server Error');
    }
};


exports.singleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const categories = await Category.find();
        const product = await Product.findById(productId).populate('categoryName').populate('subCategoryName').populate('extraCategoryName');
        if (!product) {
            return res.redirect('/webPage/home');
        }
        const relatedProducts = await Product.find({
            categoryName: product.categoryName._id, _id: { $ne: product._id }
        });
        let cartCount = 0;
        if (req.session.user) {
            const cart = await Cart.findOne({ user: req.session.user.id });
            cartCount = cart ? cart.items.length : 0;
        }
        res.render('Website/singleProduct', { product, categories, relatedProducts, session: req.session, cartCount });
    } catch (err) {
        console.error('Single Product Page Error:', err);
        res.redirect('/webPage/home');
    }
};


exports.filterProducts = async (req, res) => {
    try {
        const { category = [], price = '' } = req.body;
        let filter = {};
        if (category.length) {
            filter.categoryName = { $in: category };
        }
        if (price) {
            const [minPrice, maxPrice] = price.split('-');
            if (maxPrice) {
                filter.productPrice = { $gte: Number(minPrice), $lte: Number(maxPrice) };
            } else {
                filter.productPrice = { $gte: Number(minPrice) };
            }
        }
        const categories = await Category.find();
        const products = await Product.find(filter).populate('categoryName');
        let cartCount = 0;
        if (req.session.user) {
            const cart = await Cart.findOne({ user: req.session.user.id });
            cartCount = cart ? cart.items.length : 0;
        }
        res.render('Website/home', { categories, products, cartCount });
    } catch (error) {
        console.error('Filter Products Error:', error);
        res.status(500).send('Server Error');
    }
};


exports.addToCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/webPage/userLogin');
        }
        const userId = req.session.user.id;
        const productId = req.body.productId;
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += 1;
        } else {
            cart.items.push({ product: productId, quantity: 1 });
        }
        await cart.save();
        res.redirect('/webPage/cart');
    } catch (error) {
        console.error('Add to Cart Error:', error);
    }
};


exports.viewCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/webPage/userLogin');
        }
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        const cartCount = cart ? cart.items.length : 0;
        res.render('Website/cartPage', { singleProCart: cart, cartCount });
    } catch (error) {
        console.error('View Cart Error:', error);
        res.status(500).send('Server Error');
    }
};


exports.placeOrder = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/webPage/userLogin');
        }
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (cart && cart.items.length > 0) {
            const newOrder = new Order({
                user: userId,
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                }))
            });
            await newOrder.save();
            cart.items = [];
            await cart.save();
            return res.redirect('/webPage/userOrders');
        } else {
            return res.redirect('/webPage/cart');
        }
    } catch (error) {
        console.error('Place Order Error:', error);
        res.redirect('/webPage/cart');
    }
};


exports.productQuantity = async (req, res) => {
    try {
        const { productId, action } = req.body;
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );
            if (itemIndex !== -1) {
                if (action === 'increase') {
                    cart.items[itemIndex].quantity += 1;
                } else if (action === 'decrease') {
                    cart.items[itemIndex].quantity -= 1;
                    if (cart.items[itemIndex].quantity <= 0) {
                        cart.items.splice(itemIndex, 1);
                    }
                }
                await cart.save();
            }
        }
        res.redirect('/webPage/cart');
    } catch (error) {
        console.error("Product Quantity Error:", error);
        res.redirect('/webPage/cart');
    }
};


exports.productRemove = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = cart.items.filter(
                (item) => item.product.toString() !== productId
            );
            await cart.save();
        }
        res.redirect('/webPage/cart');
    } catch (error) {
        console.error("Product Remove Error:", error);
        res.redirect('/webPage/cart');
    }
};


exports.userProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;

        if (!userId) {
            return res.status(401).send("Unauthorized: Please log in");
        }
        const user = await productUser.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }
        if (req.session.user) {
            const cart = await Cart.findOne({ user: req.session.user.id });
            cartCount = cart ? cart.items.length : 0;
        }
        
        res.render("Website/userProfile", { user , cartCount});
     
    } catch (error) {
        console.log("User Profile page Error", error);
        res.status(500).send("Internal Server Error");
    }
};


exports.userOrders = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/webPage/userLogin');
        }
        const userId = req.session.user.id;
        const orders = await Order.find({ user: userId }).populate('items.product');
        const cart = await Cart.findOne({ user: req.session.user.id });
        const cartCount = cart ? cart.items.length : 0;
        return res.render('Website/order', { orders, cartCount });
    } catch (error) {
        console.log('User Orders Page Error:', error);
    }
};





