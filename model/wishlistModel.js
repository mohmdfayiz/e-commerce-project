const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    productIds:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        ref:'Product'
    },
})

module.exports = wishlist = mongoose.model("Wishlist",wishlistSchema)