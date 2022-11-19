const orderModel = require('../../model/orderModel');

module.exports = {

    orders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await orderModel.find({userId}).populate('products.productId').then((orders)=>{
                console.log(orders);
                resolve(orders)
            })
        })
    }
}