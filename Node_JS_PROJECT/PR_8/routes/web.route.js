const express = require("express");
const { homePage, filterProducts, productRemove, userProfile, registerPage, registerUser, userLoginPage, userLogin, singleProduct, addToCart, viewCart, placeOrder, productQuantity, userOrders, logoutUser } = require("../controllers/web.controller");


const webRouter = express.Router()

webRouter.get("/home", homePage)
webRouter.post('/products/filter', filterProducts)
webRouter.get("/registerPage", registerPage)
webRouter.post("/registerUser", registerUser);
webRouter.get("/userLogin", userLoginPage);
webRouter.post("/userLogin", userLogin);
webRouter.get("/product/:id", singleProduct);
webRouter.get("/userProfile", userProfile);

webRouter.post('/cart/add-to-cart', addToCart);
webRouter.get('/cart', viewCart);
webRouter.post('/cart/place-order', placeOrder);
webRouter.post('/cart/update-quantity', productQuantity);
webRouter.post('/cart/remove-item', productRemove);
webRouter.get('/userOrders', userOrders)

webRouter.get("/logoutUser", logoutUser);

module.exports = webRouter;