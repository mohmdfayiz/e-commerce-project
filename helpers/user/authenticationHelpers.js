const userModel = require("../../model/userModel");
const bcrypt = require("bcrypt");

module.exports = {

    userExist: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({ email: userData.email })
            user ? resolve(false) : resolve(true)
        })
    },

    user_proceed: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            const newUser = new userModel(userData)
            newUser.save().then(() => {
                resolve({ newUser })
            })
        })
    },

    resetPassword: (email,password)=>{
        return new Promise(async(resolve,reject)=>{
            password = await bcrypt.hash(password, 10)
            await userModel.findOneAndUpdate({email},{$set:{password:password}})
            resolve()
        })
    },

    updatePassword:(userId,password)=>{
        return new Promise(async(resolve,reject)=>{
            password = await bcrypt.hash(password,10)
            await userModel.findOneAndUpdate({_id:userId},{$set:{password}}).then(()=>{
                resolve()
            })
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await userModel.findOne({ $and: [{ email: userData.email }, { type: "Active" }] })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        // login success
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        // login failed! password miss match.
                        response.passwordErr = true;
                        resolve(response)
                    }
                })
            } else {
                // login failed, no such email
                response.status = false;
                resolve(response)
            }
        })
    },

    // middleware
    userStatus: (userId) => {
        return new Promise(async (resolve, reject) => {
            await userModel.findOne({ _id: userId }).then((user) => {
                let userStatus = user.type
                resolve(userStatus)
            })
        })
    },
}