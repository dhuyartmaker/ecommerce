const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var refTextModel = new mongoose.Schema({
    name:{
        type:String,
    },
    textId: {
        type: mongoose.Types.ObjectId,
        ref: 'Test',
        index: true
    }
});



//Export the model
module.exports = mongoose.model('RefText', refTextModel);