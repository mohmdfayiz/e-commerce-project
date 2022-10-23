
exports.home = (req,res) => res.render('userViews/home')
exports.login = (req,res) => res.render('userViews/userLogin')
exports.signup = (req,res) => res.render('userViews/signup')


exports.doSignup = (req,res)=>{ res.render('userViews/home')}