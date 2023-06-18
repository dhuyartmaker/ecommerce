const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var apikeySchema = new mongoose.Schema({
    key:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    status:{
        type:String,
        required:true,
    },
    permission:{
        type:[String],
        required:true,
        default: []
    },
});

//Export the model
module.exports = mongoose.model('ApiKey', apikeySchema);