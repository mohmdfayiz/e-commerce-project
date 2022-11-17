const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    cart:{
        type:ObjectId,
        required:true,
        ref:'Cart'
    },
    address:{
        type:ObjectId,
        required:true,
        ref:'Address'
    },
    paymentMethod:{
        type:String,
    },
    orderStatus:String,
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = Order = mongoose.model('Order',orderSchema);