const mongoose = require('mongoose'); // Erase if already required
const { RoleShop } = require('../config/constant');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    roles: {
        type: String,
        enum: Object.keys(RoleShop).map(key => RoleShop[key])
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('User', userSchema);