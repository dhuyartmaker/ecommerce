const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref: 'Shop'
    },
    publicKey:{
        type: String,
        required:true,
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    refreshTokenUsed:{
        type: Array, default: []
    },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('KeyToken', keyTokenSchema);