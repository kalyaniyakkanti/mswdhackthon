const express= require("express");
const router = express.Router();
const User = require("../models/user")

router.post("/register",async(req,res)=>{

    const newuser = new User(req.body)
    try {
        const user = await newuser.save()
        res.send('User Registered Successsfully')
        
    } catch (error) {
        return res.status(400).json({message: 'error'}); 
        
    }

});

router.post("/login",async(req,res)=>{

    const {email,password}=req.body
    try {
        const user = await  User.findOne({email:email,password:password})
        if(user){
            const temp={
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
                _id:user._id,
            }
        res.send(user)
        }
        else{
            return res.status(400).json({message: 'error'});   
        }
    } catch (error) {
        return res.status(400).json({message: 'error'}); 
        
    }

});

module.exports = router