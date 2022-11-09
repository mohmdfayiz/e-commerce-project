const mongoose = require ('mongoose')

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports = Category = mongoose.model('Category',categorySchema)
