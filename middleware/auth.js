const {User} = require('../models/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const jwt = require('jsonwebtoken')

exports.auth = (AllowedRole) => {
    return asyncHandler(async(req,res,next)=>{

            const token = req.cookies.accessToken || req.header('Authorization')?.replace("Bearer ","")
            
            if(!token){
                throw new apiError(401,"Unauthorize")
            }

            const decoded = await jwt.verify(token,process.env.JWT_ACCESS_SECRET)
            
            req.user = decoded

            if(AllowedRole !== req.user.role){
                throw new apiError(403,"access denied you have not a permission.")
            }
            
            next()
        
    })
}