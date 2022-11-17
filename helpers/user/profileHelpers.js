const userModel = require("../../model/userModel");
const addressModel = require("../../model/addressModel")

module.exports = {
    userProfile: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById(userId);
            let address = await addressModel.findOne({ userId })
            if (address != null) {
                let num = address.address.length - 1
                address = address.address[num]
                resolve({ user, address })
            }
            else {
                address = []
                resolve({ user, address })
            }
        })
    },
    newAddress: (userId, address) => {
        return new Promise(async (resolve, reject) => {

            let exist = await addressModel.findOne({ userId: userId })
            if (exist) {
                await addressModel.findOneAndUpdate({ userId }, { $push: { address: address } }).then(() => {
                    resolve()
                })
            } else {
                const newAddress = new addressModel({
                    userId,
                    address: [address]
                })
                newAddress.save().then(() => {
                    resolve()
                })
            }
        })
    },

    get_address: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userAddress = [];
            let address = await addressModel.findOne({ userId })
            if (address != null) {
                userAddress = address.address
            }
            resolve(userAddress)
        })
    },

    deleteAddress: (userId, adrsId) => {
        return new Promise(async (resolve, reject) => {
            await addressModel.findOneAndUpdate({ userId }, { $pull: { address: { _id: adrsId } } }).then(() => {
                resolve()
            })
        })
    },
}