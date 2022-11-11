const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const categoryModel = require("../model/categoryModel");
const subcategoryModel = require("../model/subcategoryModel")
const bcrypt = require('bcrypt');
const { login } = require('../controller/adminController');

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
            let users = await userModel.find({ type: { $not: { $eq: "admin" } } }).sort({join:-1})
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
            await userModel.findByIdAndUpdate({ _id: id }, { $set: { type: "Active" } })
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

    deleteCategory: (id) => {
        return new Promise(async (resolve, reject) => {
            await categoryModel.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true } })
            resolve()
        })
    },

    restoreCategory: (id) => {
        return new Promise(async (resolve, reject) => {
            await categoryModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: false } })
            resolve()
        })
    },

    getSubcategories: () => {
        return new Promise(async (resolve, reject) => {
            let categories = await categoryModel.find({isDeleted:false})
            let subcategories = await subcategoryModel.find()
            resolve({ categories, subcategories })
        })
    },

    subcategories: ()=>{
        return new Promise(async(resolve,reject)=>{
            let categories = await subcategoryModel.find({isDeleted:false})
            resolve(categories)
        })
    },

    addSubcategory: (data) => {
        return new Promise(async (resolve, reject) => {
            const newSubcategory = await subcategoryModel(data)
            newSubcategory.save().then(() => {
                resolve()
            })
        })
    },

    deleteSubcategories: (id) => {
        return new Promise(async (resolve, reject) => {
            await subcategoryModel.findByIdAndUpdate({ _id: id }, { isDeleted: true })
            resolve()
        })
    },

    restoreSubcategory: (id) => {
        return new Promise(async (resolve, reject) => {
            await subcategoryModel.findByIdAndUpdate({ _id: id }, { isDeleted: false })
            resolve()
        })
    },

    getProducts: () => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.find({ isDeleted: false }).populate('category').sort({createdAt:-1})
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
            let categories = await subcategoryModel.find({ _id: { $ne: product.category } })
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