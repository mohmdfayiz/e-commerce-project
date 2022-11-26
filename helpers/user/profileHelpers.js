const userModel = require("../../model/userModel");
const addressModel = require("../../model/addressModel")

module.exports = {

    getUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await userModel.findById({ _id: userId }).then(user => resolve(user))
        })
    },
    
    userProfile: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById(userId);
            let address = await addressModel.findOne({ userId })
            if (address != null) {
                if (address.address.length > 0) {
                    let num = address.address.length - 1
                    address = address.address[num]
                }
                else address = []
            }
            else {
                address = []
            }
            resolve({ user, address })
        })
    },

    editProfile: (userId, data) => {
        return new Promise(async (resolve, reject) => {
            let { userName, email } = data
            await userModel.findOneAndUpdate({ _id: userId }, { $set: { userName, email } }).then((user) => {
                console.log(user);
                resolve();
            })
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

    address: (userId, index) => {
        return new Promise(async (resolve, reject) => {
            await addressModel.findOne({ userId }).then((adrs) => {
                let address = adrs.address[index]
                console.log(address);
                resolve(address)
            })
        })
    },

    edit_address: (userId, adrsId, address) => {
        return new Promise(async (resolve, reject) => {
            await addressModel.findOneAndUpdate({ userId, 'address._id': adrsId },
                {
                    $set: {
                        "address.$.fullName": address.fullName,
                        "address.$.phoneNumber": address.phoneNumber,
                        "address.$.address": address.address,
                        "address.$.type": address.type,
                        "address.$.city": address.city,
                        "address.$.state": address.state,
                        "address.$.pincode": address.pincode
                    }
                }).then(() => {
                    resolve()
                })
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