const authHelpers = require('../helpers/user/authenticationHelpers')
const nodemailer = require("nodemailer");

// USER LOGIN PAGE
exports.signin = (req, res) => {
    let loginErr = req.session.loginErr;
    let passwordErr = req.session.passwordErr
    req.session.userLogin ? res.redirect("/")
      : res.render("userViews/userLogin", { loginErr, passwordErr });
  };
  
  // DO_LOGIN
  exports.doLogin = async (req, res) => {
  
    req.session.loginErr = false;
    req.session.passwordErr = false;
  
    authHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.userLogin = true
        req.session.user = response.user // user data
        res.redirect('/')
      } else if (response.passwordErr) {
        req.session.passwordErr = true
        res.redirect('/signin')
      } else {
        req.session.loginErr = true
        res.redirect('/signin')
      }
    })
  };
  
  // USER SIGN UP PAGE
  exports.signup = (req, res) => {
    req.session.userLogin ? res.redirect("/")
      : res.render("userViews/signup", { emailExist: req.session.exist });
  };
  
  // OTP PAGE
  exports.email_vairification = (req, res) => {
    let status = req.session.resend;
    let otpErr = req.session.otpErr;
    res.render('userViews/otp', { email, status, otpErr })
  }
  
  // OTP 
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  var email;
  var userData;
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',
  
    auth: {
      user: 'rideauthentication@gmail.com',
      pass: 'ztksvhjupmgmjcwz',
    }
  });
  
  // DO_SIGNUP
  exports.doSignup = async (req, res) => {
  
    req.session.exist = false;
    req.session.otpErr = false;
    req.session.resend = false;
    userData = req.body;
  
    authHelpers.userExist(userData).then((result) => {
      if (result) {
        res.redirect('/email_varification');
        email = userData.email;
        // send mail with defined transport object
        var mailOptions = {
          to: email,
          subject: "Otp for registration: ",
          html: "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
      } else {
        req.session.exist = true;
        res.redirect('/signup')
      }
    })
  };
  
  // RESEND OTP
  exports.resendOtp = (req, res) => {
    var mailOptions = {
      to: email,
      subject: "Otp for registration is: ",
      html: "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      req.session.resend = true;
      res.redirect('/email_varification');
    });
  }
  
  // OTP VARIFICATION
  exports.varifyOtp = (req, res) => {
    if (req.body.otp == otp) {
      authHelpers.user_proceed(userData).then((result) => {
        userData = null;
        req.session.userLogin = true
        req.session.user = result.newUser // user data
        res.redirect('/');
      })
    }
    else {
      // incorrect otp
      req.session.otpErr = true;
      res.redirect('/email_varification');
    }
  }
  
  // FORGOT PASSWORD PAGE
  exports.forgotPassword = (req, res) => {
    res.render('userViews/forgotPassword')
  }
  
  // EMAIL VARIFICATION FOR CHANGE PASSWORD PAGE
  exports.emailVarification = (req, res) => {
    let email = req.session.passwordMail
    res.render('userViews/changePassword-otp', { email })
  }
  
  // CHANGE PASSWORD PAGE
  exports.changePassword = (req, res) => {
    res.render('userViews/changePassword')
  }
  
  // OTP FOR CHANGE PASSWORD
  exports.sendOtp = (req, res) => {
    let email = req.body.email
    authHelpers.userExist(req.body).then(result => {
      if (!result) {
        // send mail with defined transport object
        var mailOptions = {
          to: email,
          subject: "Otp for Change password: ",
          html: "<h3>OTP for change password is </h3>" +
            "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        req.session.passwordMail = email
        res.redirect('/emailVarification');
      } else {
        req.session.exist = true;
        res.redirect('/forgotPassword')
      }
    })
  }
  
  // RESEND OTP
  exports.resend = (req, res) => {
    let email = req.session.passwordMail
    var mailOptions = {
      to: email,
      subject: "Otp for change password: ",
      html: "<h3>OTP for change password is </h3>" +
        "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.redirect('/forgotpassword');
    });
  }
  
  // OTP VARIFICATION FOR CHANGE PASSWORD
  exports.varify = (req, res) => {
    req.body.otp == otp ? res.redirect('/changePassword') : res.redirect('/emailVarification');
  }
  
  // SET PASSWORD
  exports.setPassword = (req, res) => {
    let email = req.session.passwordMail
    req.body.password1 == req.body.password2 ?
      authHelpers.resetPassword(email, req.body.password2).then(() => {
        res.redirect('/signin')
      })
      : res.redirect('/changePassword')
  }
  
  // LOGOUT
  exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
  }; 
  