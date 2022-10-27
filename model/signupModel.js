const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
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