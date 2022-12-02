const mongoose = require ('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const couponShema = new mongoose.Schema({
    coupon_code:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    created_date:{
        type:Date,
        default:Date.now()
    },
    expiry_date:{
        type:Date,
        required:true
    },
    users:[ObjectId],
    is_deleted:{type:Boolean,default:false}
})

module.exports = mongoose.model('Coupon',couponShema)
