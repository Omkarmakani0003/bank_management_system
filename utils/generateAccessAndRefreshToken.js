const {User} = require('../models/user.model')
const apiError = require('../utils/apiError')

exports.generateAccessAndRefreshToken = async(id)=>{
     try{

        const user = await User.findById(id)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await  user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save()
        return {accessToken,refreshToken}

     }catch(error){
        throw new apiError(500,error.message)
     }
}