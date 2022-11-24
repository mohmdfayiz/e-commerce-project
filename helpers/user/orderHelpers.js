const orderModel = require('../../model/orderModel');

module.exports = {

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