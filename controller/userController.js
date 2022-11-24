const productHelpers = require("../helpers/user/productHelpers")
const cartHelpers = require("../helpers/user/cartHelpers")
const profileHelpers = require('../helpers/user/profileHelpers')
const wishlistHelpers = require('../helpers/user/wishlistHelpers')
const checkoutHelpers = require('../helpers/user/checkoutHelpers')
const orderHelpers = require('../helpers/user/orderHelpers')
const { response, json } = require("express");
const { trusted } = require('mongoose')
const moment = require("moment")

// USER HOME PAGE
exports.home = (req, res) => {
  productHelpers.getProducts().then((products) => {
    const { bikes, accessoriesNgadgets } = products
    let login = req.session.userLogin ? true : false
    res.render("userViews/index", { bikes, accessoriesNgadgets, login });
  })
};

// BIKES PAGE
exports.bikes = (req, res) => {
  productHelpers.getProducts().then((products) => {
    const { bikes, accessoriesNgadgets } = products
    let login = req.session.userLogin ? true : false
    res.render('userViews/bikes', { login, bikes })
  })
};

// ACCESSORIES PAGE
exports.accessories = (req, res) => {
  productHelpers.getAccessories().then((accessories) => {
    let login = req.session.userLogin ? true : false
    res.render('userViews/accessories-page', { login, accessories })
  })
};

// GADGETS PAGE
exports.gadgets = (req, res) => {
  productHelpers.getGadgets().then((gadgets) => {
    let login = req.session.userLogin ? true : false
    res.render('userViews/gadgets-page', { login, gadgets })
  })
};


// USER ACCOUNT
exports.account = (req, res) => {
  let userId = req.session.user._id
  profileHelpers.userProfile(userId).then((result) => {
    const { user, address } = result;
    res.render('userViews/profile', { login: true, user, address })
  })
}

// USER ADDRESS PAGE
exports.manageAddress = (req, res) => {
  let userId = req.session.user._id
  profileHelpers.get_address(userId).then((address) => {
    let user = req.session.user;
    res.render('userViews/address', { login: true, user, address, index: 1 })
  })
}

// ADD NEW ADDRESS
exports.newAddress = (req, res) => {
  let userId = req.session.user._id;
  let address = req.body;
  profileHelpers.newAddress(userId, address).then(() => {
    res.redirect('/manageAddress')
  })
}

// DELETE ADDRESS
exports.deleteAddress = (req, res) => {
  let userId = req.session.user._id;
  let adrsId = req.params.id;
  profileHelpers.deleteAddress(userId, adrsId).then(() => {
    res.redirect('/manageAddress')
  })
}

// PRODUCT DETAILS
exports.product_details = async (req, res) => {

  let id = req.params.id;
  let userId = req.session.user ? req.session.user._id : 0

  productHelpers.product_details(id, userId).then((details) => {
    const { product, related_products, exist } = details
    let login = req.session.user ? true : false
    res.render('userViews/product-detail', { product, related_products, login, exist })
  })
}

// VIEW WISHLIST
exports.wishlist = (req, res) => {
  let userId = req.session.user._id
  wishlistHelpers.wishlist_items(userId).then((list) => {
    res.render('userViews/wishlist-page', { login: true, list })
  })
}

// ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
  let productId = req.params.productId
  let userId = req.session.user._id    //user id
  wishlistHelpers.addto_wishlist(userId, productId)
  res.json({ status: true })
}

// REMOVE ITEM FROM WISHLIST
exports.removeWishlistItem = async (req, res) => {
  let productId = req.params.id
  let userId = req.session.user._id
  wishlistHelpers.removeWishlistItem(userId, productId).then(() => {
    res.redirect('/wishlist')
  })
}

// VIEW CART
exports.cart = async (req, res) => {
  let userId = req.session.user._id
  cartHelpers.cart_items(userId).then((cart) => {
    if (cart) {
      let products = cart.products
      let cartTotal = cart.cartTotal
      res.render('userViews/shoping-cart', { login: true, products, cartTotal })
    } else {
      res.render('userViews/shoping-cart', { login: true, products: [] })
    }
  })
}

// ADD TO CART
exports.addToCart = (req, res) => {

  let userId = req.session.user._id
  let productId = req.params.productId
  let quantity = req.body.quantity

  cartHelpers.addto_cart(userId, productId, quantity).then(() => {
    res.redirect('/product_details/' + productId)
  })
}

// ADD TO CART FROM WISHLIST
exports.moveToCart = (req, res) => {
  let userId = req.session.user._id
  let productId = req.params.productId
  let quantity = 1;
  cartHelpers.addto_cart(userId, productId, quantity)
  res.json({ status: true })
}

// ICREMENT QUANTITY
exports.incrementQuantity = (req, res) => {
  let userId = req.session.user._id
  let productId = req.params.productId
  let price = parseInt(req.params.price)
  cartHelpers.incrementQuantity(userId, productId, price).then(() => {
    res.redirect('/cart')
  })
}

// DECREMENT QUANTITY
exports.decrementQuantity = (req, res) => {
  let userId = req.session.user._id
  let productId = req.params.productId
  let price = parseInt(req.params.price)
  price = price * -1;
  cartHelpers.decrementQuantity(userId, productId, price).then(() => {
    res.redirect('/cart')
  })
}

// REMOVE CART ITEM
exports.removeCartItem = (req, res) => {
  let userId = req.session.user._id
  let productId = req.params.productId
  let total = (req.params.total) * -1
  cartHelpers.removeCartItem(userId, productId, total).then(() => {
    res.redirect('/cart')
  })
}

// CHECKOUT PAGE
exports.checkout = (req, res) => {
  let userId = req.session.user._id
  checkoutHelpers.checkout(userId).then((result) => {
    let { cart, address } = result;
    if (cart != null && cart.products.length > 0) {
      let cartTotal = cart.cartTotal
      let cartItems = cart.products
      address = address ? address.address : 0
      let length = address ? address.length : 0
      req.body.index ? index = req.body.index : index = length - 1
      res.render('userViews/checkout', { login: true, cartTotal, cartItems, address, index });
    } else {
      res.redirect('/cart')
    }
  })
}

// CHECKOUT ADD NEW ADDRESS
exports.chekoutNewAddress = (req, res) => {
  let userId = req.session.user._id;
  let address = req.body;
  profileHelpers.newAddress(userId, address).then(() => {
    res.redirect('/checkout')
  })
}

// PLACE ORDER 
exports.placeOrder = (req, res) => {

  let userId = req.session.user._id
  let adrsIndex = req.body['index']
  let paymentMethod = req.body['paymentMethod']
  checkoutHelpers.placeOrder(userId, adrsIndex, paymentMethod).then((response) => {
    let { orderId, total } = response
    if (paymentMethod == 'COD') {
      res.json({ codSuccess: true })
    } else {
      checkoutHelpers.generateRazorpay(orderId, total).then((response) => {
        res.json(response)
      })
    }
  })
}

// VERIFY PAYMENT
exports.verifyPayment = (req, res) => {
  checkoutHelpers.verifyPayment(req.body).then(() => {
    checkoutHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      res.json({ status: true })
    })
  }).catch((err) => {
    res.json({ status: false })
  })
}

//  ORDER SUCCESS PAGE
exports.orderSuccess = (req, res) => {
  res.render('userViews/order-success', { login: true })

  // delete cart 
  let userId = req.session.user._id
  cartHelpers.deleteCart(userId)
}

// TRACK ORDERS PAGE
exports.orders = (req, res) => {
  let userId = req.session.user._id
  orderHelpers.orders(userId).then((orders) => {
    res.render('userViews/orders', { orders })
  })
}

// ORDER DETAILS PAGE
exports.orderDetails = (req, res) => {
  let orderId = req.params.orderId
  orderHelpers.orderDetails(orderId).then((order) => {
    res.render('userViews/orderDetails', { order, moment })
  })
}

// CANCEL ORDER 
exports.cancelOrder = (req,res) =>{
  let orderId = req.params.orderId
  orderHelpers.cancelOrder(orderId).then(()=>{
    res.json({response:true})
  })
}