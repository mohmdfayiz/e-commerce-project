const addressModel = require('../../model/addressModel');
const cartModel = require('../../model/cartModel');
const orderModel = require('../../model/orderModel');
const productModel = require('../../model/productModel');
const couponModel = require('../../model/couponModel')
const { address } = require('./profileHelpers');

module.exports = {

    createOrder: (userId, index, paymentMethod) => {
        return new Promise(async (resolve, reject) => {

            let cart = await cartModel.findOne({ userId })
            let coupon = cart.discount.couponId ? cart.discount.couponId : null
            let address = await addressModel.findOne({ userId })
            address = address.address[index]
            let products = cart.products;
            let paymentStatus = paymentMethod == "COD" ? "Pending" : "Paid"
            let date = new Date()
            let deliveryDate = date.setDate(date.getDate() + 7)

            const newOrder = new orderModel({
                userId,
                products,
                subTotal: cart.cartTotal,
                discount: cart.discount,
                grandTotal: cart.grandTotal,
                address,
                paymentMethod,
                paymentStatus,
                deliveryDate
            })

            newOrder.save().then(async () => {
                for (let product of products) {
                    let id = product.productId
                    let quantity = product.quantity * -1
                    await productModel.updateOne({ _id: id }, { $inc: { quantity } })
                }  
                await cartModel.findOneAndDelete({ userId })
                await couponModel.findOneAndUpdate({ _id: coupon }, { $push: { users: userId } })
                resolve()
            })
        })
    },

    orders: (userId) => {
        return new Promise(async (resolve, reject) => {
            await orderModel.find({ userId }).populate('products.productId').sort({ orderDate: -1 }).then((orders) => {
                resolve(orders)
            })
        })
    },

    orderDetails: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderModel.findById(orderId).populate('products.productId').then((order) => {
                resolve(order)
            })
        })
    },

    cancelOrder: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderModel.findByIdAndUpdate({ _id: orderId }, { $set: { orderStatus: "Cancelled", modifiedDate:Date.now() } })
            resolve()
        })
    }
}