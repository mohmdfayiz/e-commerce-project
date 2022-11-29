const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    products: [{
            productId: { type: ObjectId, ref: 'Product'},
            quantity: { type: Number, default: 1 },
            total : {type:Number,required:true},
            date: { type: Date, default: Date.now }
        }],
    
    cartTotal:Number,
    discount:{type:Number,default:0},
    grandTotal:Number
})

module.exports = cart = mongoose.model('Cart', cartSchema)