const productModel = require("../../model/productModel")
const cartModel = require("../../model/cartModel")

exports.getProducts = () => {
    return new Promise(async (resolve, reject) => {
        let products = await productModel.find({ isDeleted: false })
        resolve(products)
    })
}

exports.product_details = (id, userId) => {
    return new Promise(async (resolve, reject) => {

        let product = await productModel.findOne({ _id: id }).populate('category')
        let related_products = await productModel.find().populate('category')

        // checking that product is already in cart 
        let exist = false;
        if (userId != 0) {
            let check = await cartModel.findOne({ userId, 'products.productId': id })
            if (check != null) {
                exist = true;
            }
        }
        resolve({ product, related_products, exist })
    })
}