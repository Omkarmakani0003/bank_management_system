const {User} = require('../models/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')

exports.register = asyncHandler(

    async(req,res)=>{
        const { username, email, password } = req.body
        
        if(!username.trim() || !email || !password){
            throw new apiError(400,"all fields are required")
        }

        if(username.trim() == 'system'){
            throw new apiError(400,`You can not use this username '${username.trim()}' `)
        }

        const ExistingUser = await User.findOne({email})

        if(ExistingUser){
            throw new apiError(400,"Email is already taken")
        }

        const NewUser = await User.create({
            username, 
            email, 
            password
        })

        return res.status(201).json(new apiResponse(201,"register success",NewUser))
    }  
)


