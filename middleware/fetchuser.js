var jwt = require('jsonwebtoken');
const env = require('../config/environment')

const JWT_SECRET = env.JWT_SECRET;
const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).json({error:"please atuthenticate using valid token"});
    }
    try{
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch {
        res.status(401).json({error:"please atuthenticate using valid token"});
    }
}

module.exports = fetchuser;