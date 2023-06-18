const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var testSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    text: { 
        type:String,
    },
    text2: {
        type: String
    }
});

testSchema.index({ text: "text", text2: "text" })

//Export the model
module.exports = mongoose.model('Test', testSchema);