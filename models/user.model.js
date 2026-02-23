const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: [true,'Email is already taken'] 
    },
    password:{
        type: String,
        require: true,
        select: false
    },
    role:{
        type: String,
        enum:["admin","customer"],
        default:"customer"
    },
    refreshToken : {
        type: String,
    }

})

/**
* Password hashing
*/
userSchema.pre('save',async function(){

    if(this.isModified('password')){
      const hashPassword = await bcrypt.hash(this.password,10)
      return this.password = hashPassword
    } 

})

/**
* Password comparing
*/
userSchema.methods.passwordValidate = async function(password){
    return await bcrypt.compare(password,this.password)   
}

/**
* Generate Access Token
*/

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role
        },
        process.env.JWT_ACCESS_SECRET, 
        {
            expiresIn:process.env.JWT_ACCESS_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role
        },
        process.env.JWT_REFRESH_SECRET, 
        {
            expiresIn:process.env.JWT_REFRESH_EXPIRY
        }
    )
}

const User = mongoose.model('user',userSchema)

module.exports = {
    User,
}