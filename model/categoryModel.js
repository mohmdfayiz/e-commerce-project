const mongoose = require ('mongoose')

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    }
})

module.exports = Category = mongoose.model('Category',categorySchema)
