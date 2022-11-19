const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const addressSchema = new mongoose.Schema({

    userId:{
        type:ObjectId,
        required:true,
        ref:'User'
    },
    address:[{
        fullName:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true 
        },
        address:{
            type:String,
            required:true
        },
        type:{
            type:String
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
    }]
    
})

module.exports = address = mongoose.model('Address',addressSchema)