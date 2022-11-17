const authHelpers = require("../helpers/user/authenticationHelpers");

// MIDDLEWARE FOR USER AUTHENTICATION
exports.userAuth = (req, res, next) => {
  if (req.session.userLogin) {
    let userId = req.session.user._id
    authHelpers.userStatus(userId).then((userStatus) => {
      if (userStatus === "Active") {
        next()
      } else {
        req.session.destroy();
        res.redirect("/");
      }
    })
  } else {
    res.redirect("/login");
  }
};

// MIDDLEWARE FOR ADMIN AUTHENTICATION
exports.adminSession = (req, res, next) => {
  if (req.session.adminLogin) {
    next();
  } else {
    res.redirect("/admin");
  }
};