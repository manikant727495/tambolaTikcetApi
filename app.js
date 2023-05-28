const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const env = require('./config/environment');

// connect to database
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/ticket',require('./routes/ticket'));

app.listen(env.PORT,()=>{
    console.log('server started at port:'+env.PORT);
})