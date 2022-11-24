const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    orderId:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        default: "Pending"
    },
    date:{
        type:Date
    }
})