const { response } = require("express");
const addressModel = require('../../model/addressModel')
const cartModel = require("../../model/cartModel")
const orderModel = require("../../model/orderModel");

const Razorpay = require('razorpay');
const { resolve } = require("path");
var instance = new Razorpay({
  key_id: 'rzp_test_nOABmeWu0jJGLN',
  key_secret: 'as4aQXuHoMWnonAaD1p4pv1C',
});

module.exports = {
    checkout: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartModel.findOne({ userId }).populate('products.productId')
            let address = await addressModel.findOne({ userId })
            resolve({ cart, address })
        })
    },

    placeOrder: (userId, adrsIndex, paymentMethod) => {
        return new Promise(async (resolve, reject) => {
            
            let addresses = await addressModel.findOne({userId})
            let address = addresses.address[adrsIndex]

            let cart = await cartModel.findOne({ userId })
            let total = cart.cartTotal
            let products = cart.products

            const newOrder = new orderModel({
                userId,
                products,
                total,
                address,
                paymentMethod 
            })
            newOrder.save().then(async() => {
                await cartModel.findByIdAndDelete({ _id: cart._id })
                let orderId = newOrder._id, total = newOrder.total
                resolve({orderId, total})
            })
        })
    },

    generateRazorpay: (orderId, total)=>{
        return new Promise (async(resolve,reject)=>{
            instance.orders.create({
                amount: total * 100,
                currency: "INR",
                receipt: "" + orderId,
                
              },function (err,order) {
                console.log("New order ", order)
                resolve(order)
              })
        })
    },

    verifyPayment:(details)=>{
        return new Promise (async(resolve,reject)=>{
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'as4aQXuHoMWnonAaD1p4pv1C')
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if(hmac === details['payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }
        })
    },

    changePaymentStatus:(orderId)=>{
        return new Promise (async(resolve,reject)=>{
            orderModel.findOneAndUpdate({_id:orderId},{$set:{orderStatus:"Completed"}})
            resolve()
        })
    }
}