const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const categoryModel = require("../model/categoryModel");
const bcrypt = require('bcrypt')

module.exports = {

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await userModel.findOne({ $and: [{ email: userData.email }, { type: "admin" }] })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        console.log("login failed! password miss match.");
                        response.passwordErr = true;
                        resolve(response)
                    }
                })
            } else {
                console.log('login failed, no such email');
                response.status = false;
                resolve(response)
            }
        })
    },

    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await userModel.find({ type: { $not: { $eq: "admin" } } })
            resolve(users)
        })
    },

    blockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            await userModel.findByIdAndUpdate({ _id: id }, { $set: { type: "Blocked" } })
            resolve()
        })
    },

    unblockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            await userModel.findByIdAndUpdate({ _id: id }, { $set: { type: "user" } })
            resolve()
        })
    },

    getCategories: () => {
        return new Promise(async (resolve, reject) => {
            let categories = await categoryModel.find()
            resolve(categories)
        })
    },

    addCatergory: (category) => {
        return new Promise(async (resolve, reject) => {
            const newCategory = categoryModel({ category })
            newCategory.save().then(() => {
                resolve()
            })
        })
    },

    deleteCategory:(id)=>{
        return new Promise (async(resolve,reject)=>{
            await categoryModel.findByIdAndDelete({ _id: id })
            resolve()
        })
    },

    getProducts: () => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.find({ isDeleted: false }).populate('category')
            resolve(product)
        })
    },

    newProduct: (data, img) => {
        return new Promise(async (resolve, reject) => {
            const { category, productName, description, price, quantity } = data;
            const newProduct = productModel({
                category,
                productName,
                description,
                price,
                quantity,
                imageUrl: img.path,
            });

            await newProduct
                .save()
                .then(() => {
                    resolve(newProduct)
                })
        })
    },

    editProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.findOne({ _id: id }).populate('category')
            let categories = await categoryModel.find({ _id: { $ne: product.category } })
            resolve({ product, categories })
        })
    },

    editProductDetails: (id, data, img) => {
        return new Promise(async (resolve, reject) => {
            const { category, productName, description, price, quantity } = data

            if (img) {
                let image = img;
                await productModel.findByIdAndUpdate({ _id: id }, { $set: { imageUrl: image.path } })
            }
            let details = await productModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        category,
                        productName,
                        description,
                        price,
                        quantity,
                        modifiedAt: Date.now()
                    },
                }
            );
            await details.save().then(() => {
                resolve(details)
            });
        })
    },

    deleteProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            await productModel.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true } })
            resolve()
        })
    },

    deletedProducts: () => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.find({ isDeleted: true }).populate('category')
            resolve(product)
        })
    },

    restoreProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            await productModel.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: false } })
            resolve()
        })
    }


}