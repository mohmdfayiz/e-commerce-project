const mongoose = require ('mongoose')

const subcategorySchema = new mongoose.Schema({
    parentCategory:{
        type:String,
        required: true,
    },
    category:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports = Subcategory =  mongoose.model('Subcategory',subcategorySchema)
