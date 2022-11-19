const productModel = require("../../model/productModel")
const cartModel = require("../../model/cartModel")

exports.getProducts = () => {
    return new Promise(async (resolve, reject) => {
        let products = await productModel.find({ isDeleted: false }).populate('category')
        let bikes = []
        let accessoriesNgadgets = []
        products.forEach(product => {
            if (product.category.parentCategory === 'Bicycle') {
                bikes.push(product)
            } else {
                accessoriesNgadgets.push(product)
            }
        });
        resolve({ bikes, accessoriesNgadgets })
    })
}
exports.getAccessories = () => {
    return new Promise(async (resolve, reject) => {
        let products = await productModel.find({ isDeleted: false }).populate('category')
        let accessories = []
        products.forEach((prodcut) => {
            if (prodcut.category.parentCategory === 'Accessories') {
                accessories.push(prodcut)
            }
        })
        resolve(accessories)
    })
}
exports.getGadgets = ()=>{
    return new Promise(async(resolve,reject)=>{
        let products = await productModel.find({ isDeleted: false }).populate('category')
        let gadgets = []
        products.forEach((product)=>{
            product.category.parentCategory === "Gadgets" ? gadgets.push(product) : null
        })
        resolve(gadgets)
    })
}
exports.product_details = (id, userId) => {
    return new Promise(async (resolve, reject) => {

        let product = await productModel.findOne({ _id: id }).populate('category')
        let related_products = await productModel.find({ _id: { $ne: id } }).populate('category')

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