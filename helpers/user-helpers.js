const productModel = require("../model/productModel");
const userModel = require("../model/userModel");
const cartModel = require("../model/cartModel")
const wishlistModel = require("../model/wishlistModel")
const bcrypt = require("bcrypt");
const { populate } = require("../model/productModel");
const { response } = require("express");

module.exports = {

    getProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await productModel.find({ isDeleted: false })
            resolve(products)
        })
    },

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({ email: userData.email })
            if (user) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    },

    user_proceed: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            const newUser = new userModel(userData)
            newUser.save().then(() => {
                resolve({ newUser })
            })
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await userModel.findOne({ $and: [{ email: userData.email }, { type: "Active" }] })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        console.log("login failed! password miss match.");
                        response.passwordErr = true;
                        resolve(response)
                    }
                })
            } else {
                console.log('login failed, no such email');
                response.status = false;
                resolve(response)
            }
        })
    },

    userStatus: (userId) => {
        return new Promise(async (resolve, reject) => {
            await userModel.findOne({ _id: userId }).then((user) => {
                let userStatus = user.type
                resolve(userStatus)
            })
        })
    },

    product_details: (id, userId) => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.findOne({ _id: id }).populate('category')
            let related_products = await productModel.find().populate('category')
            resolve({ product, related_products })
        })
    },

    wishlist_items: (userId) => {
        return new Promise(async (resolve, reject) => {
            let list = await wishlistModel.findOne({ userId: userId }).populate('productIds').then((list) => {
                if (list) {
                    resolve(list.productIds)
                } else {
                    resolve()
                }
            })
        })
    },

    addto_wishlist: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishlistModel.findOne({ userId: userId })
            if (wishlist) {
                await wishlistModel.findOneAndUpdate({ userId: userId }, { $push: { productIds: productId } }).then(() => {
                    resolve()
                })
            } else {
                const wish = new wishlistModel({
                    userId,
                    productIds: [productId]
                })
                wish.save().then(() => {
                    resolve()
                })
            }
        })
    },

    removeWishlistItem: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            await wishlistModel.findOneAndUpdate({ userId }, { $pull: { productIds: productId } }).then((res) => {
                resolve()
            })
        })
    },

    moveToCart: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            let cart = cartModel.findOne({ userId })
            if (cart) {
                await cartModel.findOneAndUpdate({ userId: userId }, { $push: { products: { productId } } })
                resolve()
            } else {
                const newCart = new cartModel({
                    userId: userId,
                    products: [{ productId, quantity }]
                })
                newCart.save().then(() => {
                    resolve()
                })
            }
        })
    },

    cart_items: (userId) => {
        return new Promise(async (resolve, reject) => {
            await cartModel.findOne({ userId }).populate('products.productId').then((cart) => {
                if (cart) {
                    resolve(cart.products)
                } else {
                    resolve()
                }
            })
        })
    },

    addto_cart: (userId, productId, quantity) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId })
            if (cart) {
                await cartModel.findOneAndUpdate({ userId: userId }, { $push: { products: { productId, quantity } } })
                resolve()
            } else {
                const newCart = new cartModel({
                    userId: userId,
                    products: [{ productId, quantity }]
                })
                newCart.save().then(() => {
                    resolve()
                })
            }
        })
    },

    removeCartItem: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            await cartModel.findOneAndUpdate({ userId }, { $pull: { products: { productId } } }).then(() => {
                resolve()
            })
        })
    }
}