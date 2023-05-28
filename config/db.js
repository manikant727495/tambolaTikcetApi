
const mongoose = require('mongoose');
const env = require('./environment');

const connectDB = () => {
    console.log("connecting to mongodb");
    mongoose.connect(env.MONGODB_URL);

    mongoose.connection.on('connected',()=>{
        console.log('connected to database mongodb');
    });
    
    mongoose.connection.on('error',(err)=>{
        if(err)
        {
            console.log('error in db connectintio  '+err);
        }
    });
}

module.exports = connectDB;