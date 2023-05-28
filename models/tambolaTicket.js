const mongoose = require('mongoose');

const tambolaticketSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    tickets:{
        type:Array,
        required:true
    }
});

module.exports = mongoose.model('tambolaticket', tambolaticketSchema);