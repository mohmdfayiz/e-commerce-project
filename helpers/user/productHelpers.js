const productModel = require("../../model/productModel")
const bannerModel = require("../../model/bannerModel")
const cartModel = require("../../model/cartModel")
const subcategoryModel = require("../../model/subcategoryModel")

exports.getProducts = () => {
    return new Promise(async (resolve, reject) => {
        await productModel.find({ isDeleted: false }).populate('category').then(async (products) => {
            let banners = await bannerModel.find({})
            resolve({ products, banners })
        })
    })
}

exports.allProducts = () => {
    return new Promise(async (resolve, reject) => {
        // let subcategories = await subcategoryModel.distinct('category')
        let subcategories = await subcategoryModel.find()
        await productModel.find({ isDeleted: false }).populate('category').then((products) => {
            resolve({subcategories,products})
        })
    })
}

exports.filterProducts = (filter) => {
    return new Promise(async (resolve, reject) => {
        let subcategories = await subcategoryModel.find()
        if(filter == "Newness"){
            await productModel.find({isDeleted:false}).sort({createdAt:-1}).then((products)=>{
                resolve({subcategories,products})
            })
        }else if(filter == "lowToHigh"){
            await productModel.find({isDeleted:false}).sort({price:1}).then((products)=>{
                resolve({subcategories,products})
            })
        }else if( filter == "highToLow"){
            await productModel.find({isDeleted:false}).sort({price:-1}).then((products)=>{
                resolve({subcategories,products})
            })
        }else if(filter == 1000){
            await productModel.find({isDeleted:false, price:{$lte:1000}}).then((products)=>{
                resolve({subcategories,products})
            })
        }else if(filter == 5000){
            await productModel.find({isDeleted:false, price:{$lte:5000, $gte:1000}}).then((products)=>{
                resolve({subcategories,products})
            })
        }else if(filter == 10000){
            await productModel.find({isDeleted:false, price:{$gte:10000}}).then((products)=>{
                resolve({subcategories,products})
            })
        }else{
            await productModel.find({isDeleted: false, category:filter}).then((products)=>{
                resolve({subcategories,products})
            })
        }
    })
}

exports.getBikes = () => {
    return new Promise(async (resolve, reject) => {
        let products = await productModel.find({ isDeleted: false }).populate('category')
        let bikes = []
        products.forEach((prodcut) => {
            if (prodcut.category.parentCategory === 'Bike') {
                bikes.push(prodcut)
            }
        })
        console.log(bikes);
        resolve(bikes)
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

exports.getGadgets = () => {
    return new Promise(async (resolve, reject) => {
        let products = await productModel.find({ isDeleted: false }).populate('category')
        let gadgets = []
        products.forEach((product) => {
            product.category.parentCategory === "Gadgets" ? gadgets.push(product) : null
        })
        resolve(gadgets)
    })
}

exports.product_details = (id, userId) => {
    return new Promise(async (resolve, reject) => {

        let product = await productModel.findOne({ _id: id }).populate('category')
        let related_products = await productModel.find({ _id: { $ne: id }, isDeleted:false }).populate('category')

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