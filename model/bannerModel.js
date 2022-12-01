const mongoose = require ('mongoose')

const bannerSchema = new mongoose.Schema({
    bannerName:{
        type:String,
        required: true,
    },
    subTitle:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
})

module.exports = Banner =  mongoose.model('Banner',bannerSchema)
