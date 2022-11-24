const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    products:[{
        productId: { type: ObjectId, ref: 'Product'},
        quantity: { type: Number},
        total : {type:Number,required:true}
    }],
    total:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    paymentMethod:{
        type:String,
    },
    paymentStatus:{
        type:String,
        default:'Pending'
    },
    orderStatus:{
        type:String,
        default:'Order Placed'
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = Order = mongoose.model('Order',orderSchema);