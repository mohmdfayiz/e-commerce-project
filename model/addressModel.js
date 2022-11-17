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
        pincode:{
            type:Number,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        }
    }]
    
})

module.exports = address = mongoose.model('Address',addressSchema)