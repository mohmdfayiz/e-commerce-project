const mongoose = require ('mongoose')

const productSchema = new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Category',
    },
    productName:{
        type:String,
        required:[true,'product should have a name']
    },
    description:{
        type:String, 
        required:[true,'please add something about product']
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:String, 
        required:true
    },
    imageUrl:{
        type:String,
        require:true
    },
    isDeleted:{
        type:Boolean,
        default:false 
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    modifiedAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = Product = mongoose.model('Product',productSchema)