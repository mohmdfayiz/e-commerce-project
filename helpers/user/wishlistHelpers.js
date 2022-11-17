const { response } = require("express");
const wishlistModel = require("../../model/wishlistModel")

module.exports = {
    wishlist_items: (userId) => {
        return new Promise(async (resolve, reject) => {

            let list = [];
            await wishlistModel.findOne({ userId: userId }).populate('productIds').then((wishlist) => {
                if (wishlist) {
                    list = wishlist.productIds
                }
                resolve(list)
            })
        })
    },

    addto_wishlist: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishlistModel.findOne({ userId })
            if (wishlist) {
                await wishlistModel.findOneAndUpdate({ userId: userId }, { $addToSet: { productIds: productId } }).then(() => {
                    resolve()
                })
            } else {
                const wish = new wishlistModel({
                    userId,
                    productIds: [productId]
                })
                wish.save().then(() => {
                    resolve()
                })
            }
        })
    },

    removeWishlistItem: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            await wishlistModel.findOneAndUpdate({ userId }, { $pull: { productIds: productId } }).then((res) => {
                resolve()
            })
        })
    },

}