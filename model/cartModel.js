const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    products: {
        type: [{ productId: ObjectId, quantity: Number }],
        ref: 'Product'
    },
})

module.exports = cart = mongoose.model('Cart', cartSchema)