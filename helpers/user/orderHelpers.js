const addressModel = require('../../model/addressModel');
const cartModel = require('../../model/cartModel');
const orderModel = require('../../model/orderModel');
const productModel = require('../../model/productModel');
const { address } = require('./profileHelpers');

module.exports = {

    createOrder:(userId, index, paymentMethod)=>{
        return new Promise(async(resolve,reject)=>{

            let cart = await cartModel.findOne({userId})
            let address = await addressModel.findOne({userId})
            address = address.address[index]
            let products = cart.products;
            let paymentStatus = paymentMethod == "COD" ? "Pending" : "Paid"
            
            const newOrder = new orderModel({
                userId,
                products,
                subTotal:cart.cartTotal,
                discount:cart.discount,
                grandTotal: cart.grandTotal,
                address,
                paymentMethod,
                paymentStatus
            })

            newOrder.save().then(async()=>{
                for(let product of products){
                    let id = product.productId
                    let quantity = product.quantity * -1
                    await productModel.updateOne({_id:id},{$inc:{quantity}})
                }
                await cartModel.findOneAndDelete({userId})
                resolve()
            })
        })
    },

    orders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await orderModel.find({userId}).populate('products.productId').sort({date:-1}).then((orders)=>{
                resolve(orders)
            })
        })
    },
    
    orderDetails:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            await orderModel.findById(orderId).populate('products.productId').then((order)=>{
                resolve(order)
            })
        })
    },

    cancelOrder:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            await orderModel.findByIdAndUpdate({_id:orderId},{$set:{orderStatus:"Cancelled"}})
            resolve()
        })
    }
}