const { response } = require("express");
const addressModel = require('../../model/addressModel')
const cartModel = require("../../model/cartModel")
const orderModel = require("../../model/orderModel")

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

            const newOrder = new orderModel({
                cart: cart._id,
                address: adrsId,
                paymentMethod: "Cash on delivery",
                orderStatus: "Placed"
            })
            newOrder.save().then(async() => {
                await cartModel.findByIdAndDelete({ _id: cart._id })
                resolve()
            })
        })
    },
}