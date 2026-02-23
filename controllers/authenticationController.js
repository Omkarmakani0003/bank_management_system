const {User} = require('../models/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {generateAccessAndRefreshToken} = require('../utils/generateAccessAndRefreshToken')


exports.login = asyncHandler(async(req,res)=>{
    const { email, password } = req.body

    if(!email || !password){
        throw new apiError(400,"Both fields are required")
    }

    const admin = await User.findOne({email}).select('+password');

    if(!admin){
        throw new apiError(400,"incorrect email or Admin not found")
    }
    
    const passwordVarification = await admin.passwordValidate(password)

    if(!passwordVarification){
        throw new apiError(400,"Email or password is incorrect")
    }

    const token = await generateAccessAndRefreshToken(admin._id)
    
    const {accessToken, refreshToken} = token

    const options = {
        httpOnly : true,
        secure : true
    }

    const loggedIn = await User.findById(admin._id).select('-refreshToken')

    res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(200,`${admin.username} is loggin sucessfully`, {loggedIn,accessToken,refreshToken}))
})