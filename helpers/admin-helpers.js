const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const categoryModel = require("../model/categoryModel");
const subcategoryModel = require("../model/subcategoryModel")
const orderModel = require('../model/orderModel');
const bcrypt = require('bcrypt');
const { login } = require('../controller/adminController');
const couponModel = require('../model/couponModel');
const bannerModel = require('../model/bannerModel')

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

    dashboardDetails: () => {
        return new Promise(async (resolve, reject) => {

            let Delivered = await orderModel.find({ orderStatus: "Delivered" }).countDocuments()
            let allProducts = await productModel.find({ isDeleted: false }).countDocuments()
            let activeUsers = await userModel.find({ type: "Active" }).countDocuments()
            let liveOrders = await orderModel.find({ orderStatus: { $nin: ["Delivered", "Cancelled"] } }).countDocuments()
            let newOrders = await orderModel.find().sort({ orderDate: -1 }).limit(8)
            let newUsers = await userModel.find({ type: "Active" }).sort({ join: -1 }).limit(5)

            let start = new Date();
            start.setHours(0, 0, 0, 0);
            let end = new Date();
            end.setHours(23, 59, 59, 999);
            let ordersToday = await orderModel.find({ orderDate: { $gte: start, $lt: end } }).countDocuments()

            let online = await orderModel.aggregate([
                { '$match': { $and: [{ 'paymentMethod': 'Razorpay' }, { 'orderStatus': { '$ne': 'Cancelled' } }] } },
                { '$group': { '_id': null, 'total': { '$sum': "$grandTotal" } } }
            ])

            let sales = await orderModel.aggregate([
                { '$match': { 'orderStatus': { '$ne': 'Cancelled' } } },
                { '$group': { '_id': null, 'totalCount': { '$sum': '$grandTotal' } } }
            ])
            console.log(online);
            const onlinePayments = online.map(a => a.total)
            const totalSales = sales.map(a => a.totalCount)
            resolve({ allProducts, activeUsers, liveOrders, totalSales, onlinePayments, newOrders, newUsers, ordersToday })
        })
    },

    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await userModel.find({ type: { $not: { $eq: "admin" } } }).sort({ join: -1 })
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
            let categories = await categoryModel.find({ isDeleted: false })
            let subcategories = await subcategoryModel.find()
            resolve({ categories, subcategories })
        })
    },

    subcategories: () => {
        return new Promise(async (resolve, reject) => {
            let categories = await subcategoryModel.find({ isDeleted: false })
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

    getProducts: (page) => {
        return new Promise(async (resolve, reject) => {

            let productsPerPage = 5;
            let totalProducts = await productModel.find().countDocuments()
            let totalPages = Math.ceil(totalProducts / productsPerPage)
            let skip = (page - 1) * productsPerPage

            let products = await productModel.find({ isDeleted: false }).populate('category').sort({ createdAt: -1 }).skip(skip).limit(productsPerPage)
            resolve({ products, totalPages })
        }).catch(err => console.log(err))
    },

    newProduct: (data, images) => {
        return new Promise(async (resolve, reject) => {
            const { category, productName, shortDescription, description, price, quantity } = data;
            const newProduct = productModel({
                category,
                productName,
                shortDescription,
                description,
                price,
                quantity,
                imageUrl: images
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

    editProductDetails: (id, data, images) => {
        return new Promise(async (resolve, reject) => {
            const { category, productName, shortDescription, description, price, quantity } = data

            if (images != null) {
                await productModel.findByIdAndUpdate({ _id: id }, { $set: { imageUrl: images } })
            }
            let details = await productModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        category,
                        productName,
                        shortDescription,
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
    },

    orders: (page) => {
        return new Promise(async (resolve, reject) => {

            let productsPerPage = 10;
            let totalProducts = await productModel.find().countDocuments()
            let totalPages = Math.ceil(totalProducts / productsPerPage)
            let skip = (page - 1) * productsPerPage

            await orderModel.find().sort({ orderDate: -1 }).populate('products.productId').skip(skip).limit(productsPerPage).then(async (orders) => {
                resolve({ orders, totalPages })
            })
        })
    },

    orderDetails: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderModel.findById(orderId).populate('products.productId').then((order) => {
                resolve(order)
            })
        })
    },

    changeOrderStatus: (orderId, status) => {
        return new Promise(async (resolve, reject) => {
            await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { orderStatus: status, modifiedDate: Date.now() } }).then(() => {
                resolve()
            })
        })
    },

    changePaymentStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { paymentStatus: "Paid", modifiedDate: Date.now() } }).then(() => {
                resolve()
            })
        })
    },

    getCoupons: () => {
        return new Promise(async (resolve, reject) => {
            await couponModel.find().then(coupon => resolve(coupon))
        })
    },

    newCoupon: (data) => {
        return new Promise(async (resolve, reject) => {
            let { coupon_code, discount, expiry_date } = data;
            discount = parseInt(discount)
            const newCoupon = new couponModel({
                coupon_code,
                discount,
                expiry_date
            })
            newCoupon.save().then(() => {
                resolve()
            })
        })
    },

    deleteCoupon: (id) => {
        return new Promise(async (resolve, reject) => {
            await couponModel.updateOne({ _id: id }, { $set: { is_deleted: true } })
            resolve()
        })
    },

    restoreCoupon: (id) => {
        return new Promise(async (resolve, reject) => {
            await couponModel.updateOne({ _id: id }, { $set: { is_deleted: false } })
            resolve()
        })
    },

    getBanners: () => {
        return new Promise(async (resolve, reject) => {
            await bannerModel.find({}).then((banners) => {
                resolve(banners)
            })
        })
    },

    newBanner: (details, image) => {
        return new Promise(async (resolve, reject) => {
            const { bannerName, subTitle, title } = details
            const newBanner = new bannerModel({
                bannerName,
                subTitle,
                title,
                imageUrl: image
            })
            newBanner
                .save()
                .then(() => resolve())
        })
    },

    getBanner: (id) => {
        return new Promise(async (resolve, reject) => {
            await bannerModel.findById(id).then(banner => resolve(banner))
        })
    },

    editBanner: (id, details, image) => {
        return new Promise(async (resolve, reject) => {
            const { bannerName, subTitle, title } = details
            if (image != null) {
                await bannerModel.findByIdAndUpdate(id, { $set: { imageUrl: image[0] } })
            }
            await bannerModel.findByIdAndUpdate(id, {
                $set: {
                    bannerName,
                    subTitle,
                    title
                }
            }).then(() => resolve())
        })
    },

    deleteBanner: (id) => {
        return new Promise(async (resolve, reject) => {
            await bannerModel.findByIdAndDelete(id).then(() => resolve())
        })
    }
}