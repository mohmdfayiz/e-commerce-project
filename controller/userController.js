const productHelpers = require("../helpers/user/productHelpers")
const cartHelpers = require("../helpers/user/cartHelpers")
const profileHelpers = require('../helpers/user/profileHelpers')
const wishlistHelpers = require('../helpers/user/wishlistHelpers')
const checkoutHelpers = require('../helpers/user/checkoutHelpers')
const orderHelpers = require('../helpers/user/orderHelpers')
const { response, json } = require("express");
const { trusted } = require('mongoose')
const moment = require("moment")
const Razorpay = require('razorpay');

// USER HOME PAGE
exports.home = (req, res) => {
  productHelpers.getProducts().then((response) => {

    let { products, banners } = response
    let bikes = []
    let accessoriesNgadgets = []
    products.forEach(product => {
      product.category.parentCategory === 'Bike' ? bikes.push(product) : accessoriesNgadgets.push(product)
    });

    if (req.session.userLogin) {
      wishlistHelpers.wishlist_items(req.session.user._id).then((wishlistItems) => {
        res.render("userViews/index", { banners, bikes, accessoriesNgadgets, wishlistItems, login: true })
      })
    } else {
      res.render("userViews/index", { banners, bikes, accessoriesNgadgets, login: false })
    }
  })
};

// SHOP PAGE
exports.allProducts = (req, res) => {
  let filter = req.query.filter ? req.query.filter : ""
  productHelpers.allProducts(filter).then((response) => {
    let { subcategories, products } = response
    if (req.session.userLogin) {
      wishlistHelpers.wishlist_items(req.session.user._id).then((wishlistItems) => {
        res.render('userViews/shop', { subcategories, products, wishlistItems, login: true })
      })
    } else {
      res.render('userViews/shop', { subcategories, products, login: false })
    }
  })
}

// FILTER PRODUCTS
exports.filterProducts = (req, res) => {
  let filter = req.params.filter
  productHelpers.filterProducts(filter).then((response) => {
    let { subcategories, products } = response
    if (req.session.userLogin) {
      wishlistHelpers.wishlist_items(req.session.user._id).then((wishlistItems) => {
        res.render('userViews/shop', { subcategories, products, wishlistItems, login: true })
      })
    } else {
      res.render('userViews/shop', { subcategories, products, login: false })
    }
  })
}

// BIKES PAGE
exports.bikes = (req, res) => {
  productHelpers.getBikes().then((bikes) => {
    if (req.session.userLogin) {
      wishlistHelpers.wishlist_items(req.session.user._id).then((wishlistItems) => {
        res.render('userViews/bikes', { login: true, bikes, wishlistItems })
      })
    } else {
      res.render('userViews/bikes', { login: false, bikes })
    }
  })
};

// ACCESSORIES PAGE
exports.accessories = (req, res) => {
  productHelpers.getAccessories().then((accessories) => {
    if (req.session.userLogin) {
      wishlistHelpers.wishlist_items(req.session.user._id).then((wishlistItems) => {
        res.render('userViews/accessories-page', { login: true, accessories, wishlistItems })
      })
    } else {
      res.render('userViews/accessories-page', { login: false, accessories })

    }
  })
};

// GADGETS PAGE
exports.gadgets = (req, res) => {
  productHelpers.getGadgets().then((gadgets) => {
    if (req.session.userLogin) {
      wishlistHelpers.wishlist_items(req.session.user._id).then((wishlistItems) => {
        res.render('userViews/gadgets-page', { login: true, gadgets, wishlistItems })
      })
    } else {
      res.render('userViews/gadgets-page', { login: false, gadgets })
    }
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

// ACCOUNT SETTINGS
exports.accountSettings = (req, res) => {
  let userId = req.session.user._id
  profileHelpers.getUser(userId).then((user) => {
    res.render('userViews/account_settings', { user, login: true })
  })
}

// EDIT PROFILE
exports.editProfile = (req, res) => {
  let userId = req.session.user._id
  profileHelpers.editProfile(userId, req.body).then(() => {
    res.json({ status: true })
  })
}

// USER ADDRESS PAGE
exports.manageAddress = (req, res) => {
  let userId = req.session.user._id
  profileHelpers.get_address(userId).then((address) => {
    res.render('userViews/address', { login: true, address })
  })
}

// ADD NEW ADDRESS
exports.newAddress = (req, res) => {
  let userId = req.session.user._id;
  let address = req.body;
  profileHelpers.newAddress(userId, address).then(() => {
    res.redirect('back')
  })
}

// EDIT ADDRESS PAGE
exports.editAddress = (req, res) => {
  let index = req.params.index;
  let userId = req.session.user._id
  profileHelpers.address(userId, index).then((address) => {
    res.render('userViews/editAddress', { address, index, login: true })
  })
}

// EDIT ADDRESS
exports.edit_address = (req, res) => {
  let adrsId = req.params.index
  let userId = req.session.user._id
  let address = req.body
  profileHelpers.edit_address(userId, adrsId, address).then(() => {
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
    req.session.userLogin ?
      wishlistHelpers.wishlist_items(req.session.user._id).then((wishlistItems) => {
        res.render('userViews/product-detail', { product, related_products, wishlistItems, login: true, exist })
      })
      : res.render('userViews/product-detail', { product, related_products, login: false, exist })

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
  let userId = req.session.user._id
  await wishlistHelpers.addto_wishlist(userId, productId)
  res.json({ status: true })
}

// REMOVE ITEM FROM WISHLIST
exports.removeWishlistItem = async (req, res) => {
  let productId = req.params.id
  let userId = req.session.user._id
  await wishlistHelpers.removeWishlistItem(userId, productId)
  res.json({ status: true })
}

// VIEW CART
exports.cart = async (req, res) => {
  let userId = req.session.user._id
  cartHelpers.cart_items(userId).then((cart) => {
    if (cart) {
      let products = cart.products
      res.render('userViews/shoping-cart', { login: true, products, cart })
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
      let cartItems = cart.products
      address = address ? address.address : 0
      let length = address ? address.length : 0
      req.body.index ? index = req.body.index : index = length - 1
      res.render('userViews/checkout', { login: true, cart, cartItems, address, index });
    } else {
      res.redirect('/cart')
    }
  })
}

// APPLY COUPON
exports.applyCoupon = (req, res) => {
  let userId = req.session.user._id
  let couponCode = req.params.coupon
  checkoutHelpers.applyCoupon(userId, couponCode).then((response) => {
    response.exist ? res.json({ exist: true }) : res.json(response)
  })
}

// PLACE ORDER 
exports.placeOrder = (req, res) => {

  let userId = req.session.user._id
  let index = req.body['index']
  let paymentMethod = req.body['paymentMethod']

  checkoutHelpers.placeOrder(userId).then((response) => {
    let { cartId, total } = response
    if (paymentMethod == 'COD') {
      orderHelpers.createOrder(userId, index, paymentMethod).then(() => {
        res.json({ codSuccess: true })
      })
    } else {

      var instance = new Razorpay({
        key_id: 'rzp_test_nOABmeWu0jJGLN',
        key_secret: 'as4aQXuHoMWnonAaD1p4pv1C',
      });

      instance.orders.create({
        amount: total * 100,
        currency: "INR",
        receipt: "" + cartId,

      }, function (err, order) {
        res.json(order)
      })
    }
  })
}

// VERIFY PAYMENT
exports.verifyPayment = (req, res) => {

  let userId = req.session.user._id
  let details = req.body
  let index = details.adrsIndex

  const crypto = require('crypto')
  let hmac = crypto.createHmac('sha256', 'as4aQXuHoMWnonAaD1p4pv1C')
  hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
  hmac = hmac.digest('hex')

  if (hmac === details['payment[razorpay_signature]']) {
    orderHelpers.createOrder(userId, index, "Razorpay").then(() => {
      res.json({ status: true })
    })
  } else {
    res.json({ status: false })
  }
}

//  ORDER SUCCESS PAGE
exports.orderSuccess = (req, res) => {
  res.render('userViews/order-success', { login: true })
}

// TRACK ORDERS PAGE
exports.orders = (req, res) => {
  let userId = req.session.user._id
  orderHelpers.orders(userId).then((orders) => {
    res.render('userViews/orders', { moment, orders })
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
exports.cancelOrder = (req, res) => {
  let orderId = req.params.orderId
  orderHelpers.cancelOrder(orderId).then(() => {
    res.json({ response: true })
  })
}