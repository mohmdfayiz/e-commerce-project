const productModel = require("../model/productModel");
const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports = {

    getProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await productModel.find({ isDeleted: false })
            resolve(products)
        })
    },

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            let user = await userModel.findOne({ email: userData.email })
            if (user) {
                resolve(false)
            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                const newUser = new userModel(userData)
                newUser.save().then(() => {
                    resolve(true)
                })
            }
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await userModel.findOne({ $and: [{ email: userData.email }, { type: "user" }] })
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

    product_details: (id) => {
        return new Promise(async (resolve, reject) => {
            let product = await productModel.findOne({ _id: id })
            // let category = (await product.populate('category')).category
            let related_products = await productModel.find({ category: product.category })
            resolve({ product, related_products })
        })
    }
}