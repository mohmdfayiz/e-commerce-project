// const userHelpers = require("../helpers/user-helpers");

// // SESSION MIDDLEWARE FOR CART, WISHLIST, AND ACCOUNT
// exports.userSession = (req, res, next) => {
//     if (req.session.userLogin) {
//       next()
//     } else {
//       res.redirect('/login');
//     }
//   };
  
//   // MIDDLEWARE FOR CHECKING USER IS ACTIVE OR NOT
//   exports.userStatus = (req, res, next) => {
//     let userId = req.session.user._id
//     userHelpers.userStatus(userId).then((userStatus)=>{
//       if (userStatus === "Active") {
//         next()
//       } else {
//         req.session.destroy();
//         res.redirect("/");
//       }
//     })
//   }