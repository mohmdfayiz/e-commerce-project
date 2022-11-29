const { response } = require("express");
const addressModel = require('../../model/addressModel')
const cartModel = require("../../model/cartModel")
const couponModel = require("../../model/couponModel")


module.exports = {

    checkout: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId }).populate('products.productId')
            let address = await addressModel.findOne({ userId })
            resolve({ cart, address })
        })
    },

    applyCoupon: (userId, couponCode) => {
        return new Promise(async (resolve, reject) => {
            await couponModel.findOne({ coupon_code: couponCode }).then(async (coupon) => {
                if (coupon) {
                    // await couponModel.findOne({users:})
                    await cartModel.findOne({ userId }).then(async (cart) => {
                        let discount = ((cart.cartTotal / 100)*coupon.discount).toFixed(2);
                        let grandTotal = cart.cartTotal - discount 
                        await cartModel.findOneAndUpdate({userId},{ $set: { discount, grandTotal } })
                        await couponModel.findOneAndUpdate({coupon_code:couponCode},{$push:{users:userId}})
                        resolve(true)
                    })
                } else {
                    resolve(false)
                }
            })
        })
    },

    placeOrder: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId })
            let total = cart.cartTotal - cart.discount
            let cartId = cart._id
            resolve({cartId, total})

        })
    },

}