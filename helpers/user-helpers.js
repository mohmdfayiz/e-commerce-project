const productModel = require("../model/productModel");
const userModel = require("../model/userModel");
const cartModel = require("../model/cartModel")
const wishlistModel = require("../model/wishlistModel")
const addressModel = require("../model/addressModel")
const { populate } = require("../model/productModel");
const bcrypt = require("bcrypt");
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

    // middleware
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

            // checking that product is already in cart 
            let exist = false;
            if (userId != 0) {
                let check = await cartModel.findOne({ userId, 'products.productId': id })
                if (check != null) {
                    exist = true;
                }
            }

            resolve({ product, related_products, exist })
        })
    },

    wishlist_items: (userId) => {
        return new Promise(async (resolve, reject) => {

            let list = [];
            await wishlistModel.findOne({ userId: userId }).populate('productIds').then((wishlist) => {
                if (wishlist) {
                    list = wishlist.productIds
                }
                resolve(list)
            })
        })
    },

    addto_wishlist: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishlistModel.findOne({ userId })
            if (wishlist) {
                await wishlistModel.findOneAndUpdate({ userId: userId }, { $addToSet: { productIds: productId } }).then(() => {
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

    cart_items: (userId) => {
        return new Promise(async (resolve, reject) => {
            await cartModel.findOne({ userId }).populate('products.productId').then((cart) => {
                if (cart) {
                    resolve(cart)
                } else {
                    resolve()
                }
            })
        })
    },

    addto_cart: (userId, productId, quantity) => {
        return new Promise(async (resolve, reject) => {

            let cart = await cartModel.findOne({ userId })
            let product = await productModel.findById(productId)
            let total = product.price * quantity;

            if (cart) {
                await cartModel.findOneAndUpdate({ userId }, { $push: { products: { productId, quantity, total } }, $inc: { cartTotal: total } })
                resolve()
            } else {
                const newCart = new cartModel({
                    userId: userId,
                    products: [{ productId, quantity, total }],
                    cartTotal: total
                })
                newCart.save().then(() => {
                    resolve()
                })
            }
        })
    },

    incrementQuantity: (userId, productId, price) => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.findById(productId)
            await cartModel.findOneAndUpdate({ userId, 'products.productId': productId }, { $inc: { "products.$.quantity": 1, "products.$.total": price } })
            await cartModel.findOneAndUpdate({ userId }, { $inc: { cartTotal: product.price } })
            resolve()
        })
    },

    decrementQuantity: (userId, productId, price) => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.findById(productId)
            await cartModel.findOneAndUpdate({ userId, 'products.productId': productId }, { $inc: { "products.$.quantity": -1, "products.$.total": price } })
            await cartModel.findOneAndUpdate({ userId }, { $inc: { cartTotal: -product.price } })
            resolve()
        })
    },

    removeCartItem: (userId, productId, total) => {
        return new Promise(async (resolve, reject) => {
            await cartModel.findOneAndUpdate({ userId }, { $pull: { products: { productId } }, $inc: { cartTotal: total } }).then(() => {
                resolve()
            })
        })
    },

    userProfile: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById(userId);
            let address = await addressModel.findOne({ userId })
            if (address != null) {
                let num = address.address.length - 1
                address = address.address[num]
                resolve({ user, address })
            }
            else {
                address = []
                resolve({ user, address })
            }
        })
    },

    newAddress: (userId, address) => {
        return new Promise(async (resolve, reject) => {

            let exist = await addressModel.findOne({ userId: userId })
            if (exist) {
                await addressModel.findOneAndUpdate({ userId }, { $push: { address: address } }).then(() => {
                    resolve()
                })
            } else {
                const newAddress = new addressModel({
                    userId,
                    address: [address]
                })
                newAddress.save().then(() => {
                    resolve()
                })
            }
        })
    },

    get_address: (userId) => {
        return new Promise(async (resolve, reject) => {
            await addressModel.findOne({ userId }).then((res) => {
                resolve(res);
            })
        })
    },

    deleteAddress: (userId, id) => {
        return new Promise(async (resolve, reject) => {
            await addressModel.findOneAndUpdate({ userId }, { $pull: { address: { _id: id } } }).then((res) => {
                resolve()
            })
        })
    },

    checkout: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId }).populate('products.productId')
            let address = await addressModel.findOne({ userId })
            resolve({ cart, address })
        })
    }

}