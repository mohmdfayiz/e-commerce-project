const mongoose = require ('mongoose')

const productSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
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
    }
})

module.exports = Product = mongoose.model('Product',productSchema)