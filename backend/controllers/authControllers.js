const authController = require('express').Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

//register
authController.post("/register", async(req, res) => {
    try {
        const isExisting = await User.findOne({email: req.body.email})
        if(isExisting){
            throw new Error("Already such an account")
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await User.create({...req.body, password: hashedPassword})
        const {pasword, ...others} = newUser._doc
        const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin},process.env.JWT_SECRET, {expiresIn: '5h'})
        return res.status(201).json({others, token})
    }catch(error) {
        return res.status(500).json(error.message)
    }
})
//login
authController.post('/login', async(req, res) =>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user){
            throw new Error("Wrong password")
        }

        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if(!comparePass){
            throw new Error("Wrong password")
        }

        const {password, ...others} = user._doc
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin},process.env.JWT_SECRET, {expiresIn: "2h"})
        return res.status(200).json({others, token})
    }catch(error){
        return res.status(500).json(error.message)
    }
})

module.exports = authController