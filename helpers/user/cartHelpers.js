const { response } = require("express");
const productModel = require("../../model/productModel");
const cartModel = require("../../model/cartModel")

module.exports = {
    cart_items: (userId) => {
        return new Promise(async (resolve, reject) => {
            await cartModel.findOne({ userId }).populate('products.productId').then((cart) => {
                if (cart) {
                    console.log(cart)
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
                // checking that product already exist in cart 
                let exist = await cartModel.findOne({ userId, 'products.productId': productId })
                if (exist != null) {
                    await cartModel.findOneAndUpdate({ userId, 'products.productId': productId }, { $inc: { 'products.$.quantity': 1, 'products.$.total': total, cartTotal: total } })
                } else {
                    await cartModel.findOneAndUpdate({ userId }, { $push: { products: { productId, quantity, total } }, $inc: { cartTotal: total } })
                }
            } else {
                const newCart = new cartModel({
                    userId: userId,
                    products: [{ productId, quantity, total }],
                    cartTotal: total
                })
                newCart.save()
            }
            resolve()
        })
    },

    incrementQuantity: (userId, productId, price) => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.findById(productId)
            await cartModel.findOneAndUpdate({ userId, 'products.productId': productId }, { $inc: { "products.$.quantity": 1, "products.$.total": price, cartTotal: product.price } })
            resolve()
        })
    },

    decrementQuantity: (userId, productId, price) => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.findById(productId)
            await cartModel.findOneAndUpdate({ userId, 'products.productId': productId }, { $inc: { "products.$.quantity": -1, "products.$.total": price, cartTotal: -product.price } })
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
}