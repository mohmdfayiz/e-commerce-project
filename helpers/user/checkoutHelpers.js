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
            await couponModel.findOne({ coupon_code: couponCode, is_deleted:false, expiry_date:{$gte:Date.now()} }).then(async (coupon) => {
                if (coupon) {
                    let exist = await couponModel.findOne({coupon_code:couponCode, users: { $in: userId } })
                    if(exist){
                        resolve({exist:true})
                    }else{
                        await cartModel.findOne({ userId }).then(async (cart) => {
                            let amount = ((cart.cartTotal / 100) * coupon.discount).toFixed(0)
                            let grandTotal = cart.cartTotal - amount
                            await cartModel.findOneAndUpdate({ userId }, { $set: { discount: { couponId: coupon._id, amount }, grandTotal } })
                            resolve(true)
                        })
                    }
                } else {
                    resolve(false)
                }
            })
        })
    },

    placeOrder: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId })
            let total = cart.cartTotal - cart.discount.amount
            let cartId = cart._id
            resolve({ cartId, total })

        })
    },

}