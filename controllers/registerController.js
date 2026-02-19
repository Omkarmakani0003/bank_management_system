const {User} = require('../models/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')

exports.register = asyncHandler(

    async(req,res)=>{
        const { username, email, password} = req.body
        
        if(!username.trim() || !email || !password){
            throw new apiError(400,"all fields are required")
        }
        const data = [
            username, email, password
        ]

        const ExistingUser = await User.findOne({email})

        if(ExistingUser){
            throw new apiError(400,"Email is already taken")
        }

        return res.status(200).json(new apiResponse(200,"register success",ExistingUser))
    }  
)


