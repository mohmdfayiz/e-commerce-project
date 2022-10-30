const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        validate: validator.isEmail
    },
    password: {
        type:String,
        required:true,
    },
    type:{
        type:String,
        default:'user'
    }
})

module.exports = User = mongoose.model('User',userSchema);