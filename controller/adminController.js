const bcrypt = require('bcrypt');

exports.login = (req, res) => {
  res.render("adminViews/adminLogin");
};
exports.adminHome = (req, res) => {
  res.render("adminViews/adminHome");
};

exports.adminLogin = (req, res) => {
  const adminEmail = req.body.email;
  const password = req.body.password;

  User.findOne(
    { $and: [{ email: adminEmail }, { type: "admin" }] },
    (err, admin) => {
      if (err) console.log(err);
      if (!admin) {
        // invalid email
        console.log('invalid mail');
        res.redirect("/admin");
      } else {
        bcrypt.compare(password, admin.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            res.redirect("/admin/dashboard");

          } else {
            res.redirect("/admin");
            console.log('incorrect password');

          }
        });
      }
    }
  );
};
