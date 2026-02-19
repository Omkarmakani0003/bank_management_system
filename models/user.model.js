const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


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

userSchema.method('passwordValidate', async function(password){
    const isCheck = await bcrypt.compare(password,this,password)
    return isCheck
})

const User = mongoose.model('user',userSchema)

module.exports = {
    User,
}