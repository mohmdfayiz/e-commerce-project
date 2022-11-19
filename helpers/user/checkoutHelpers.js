const { response } = require("express");
const addressModel = require('../../model/addressModel')
const cartModel = require("../../model/cartModel")
const orderModel = require("../../model/orderModel");
const productModel = require("../../model/productModel");

module.exports = {
    checkout: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId }).populate('products.productId')
            let address = await addressModel.findOne({ userId })
            resolve({ cart, address })
        })
    },

    placeOrder: (userId, adrsId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId })
            let total = cart.cartTotal
            let products = cart.products
            const newOrder = new orderModel({
                userId,
                products,
                total,
                address: adrsId,
                paymentMethod:"Cash on delivery",
                orderStatus: "Order Placed"
            })
            newOrder.save().then(async() => {
                await cartModel.findByIdAndDelete({ _id: cart._id })
                resolve()
            })
        })
    },
}