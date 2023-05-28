const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const env = require('../config/environment');

const JWT_SECRET = env.JWT_SECRET;

//Route1: create a user using post: '/api/auth/createuser' No login required
router.post(
    '/createuser',
    [
        body('email','Enter valid email address').isEmail(),
        body('name','Enter valid name').isLength({ min: 3 }),
        body('password','Enter valid password').isLength({ min: 5 }),
    ],
    async (req , res)=>{
        // if there are errors the return bad request and errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            // check wether email already exist or not exist
            const checkUser = await User.findOne({email: req.body.email});
            if(checkUser){
                return (res.status(400).json({error: 'This email already exist'}));
            }
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password,salt);
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePassword,
            })
            return res.status(200).json({ success: "user created succesfully !" });
        } catch(error){
            console.log(error.message);
            res.status(500).send('some error occured');
        }
    }
)

//Route2: verify the user using post: '/api/auth/login' No login required
router.post(
    '/login',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ],
    async (req , res)=>{
        // if there are errors the return bad request and errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            // check wether email already exist or not exist
            const findUser = await User.findOne({email: req.body.email});
            if(!findUser){
                return res.status(400).json({error:'Please try to login with correct credential'});
            }
            const comparePassword = await bcrypt.compare(req.body.password,findUser.password);
            if(!comparePassword){
                return res.status(400).json({error:'please try to login with correct credential'});
            }
            const data = {
                user :{
                    id : findUser.id
                }
            }
            var token = jwt.sign(data, JWT_SECRET);
            res.json({success:token});
        } catch(error){
            console.log(error.message);
            res.status(500).send('some error occured');
        }
    }
)

//Route3: get the user detail using post: '/api/auth/getuser'login required
router.post(
    '/getuser',
    fetchuser,
    async (req , res)=>{
        try{
            const id = req.user.id;
            const user = await User.findById(id).select("-password");
            res.send(user);
        }catch(error){
            console.log(error.message);
            res.status(500).send('some error occured');
        }
    }
)

module.exports = router;