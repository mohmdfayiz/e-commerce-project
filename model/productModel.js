const mongoose = require ('mongoose')

const productSchema = new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Subcategory',
    },
    productName:{
        type:String,
        required:[true,'product should have a name']
    },
    shortDescription:{
        type:String, 
        required:[true,'please add something about product']
    },
    description:String,
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number, 
        required:true
    },
    imageUrl:{
        type:[String],
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