const {asyncHandler} = require('../../utils/asyncHandler')
const {User} = require('../../models/user.model')
const apiResponse = require('../../utils/apiResponse')

exports.userlist = asyncHandler(async(req,res)=>{

    const userlist = await User.aggregate([
        {$match:{'role':'customer'}},
        {
            $lookup:{
                from: 'accounts',
                localField: '_id',
                foreignField: 'userId',
                as: 'account'
            }
        },
        {
            $project:{
                'refreshToken' : 0,
                'password': 0
            }
        }
    ])

    if(!(userlist.length > 0)) return res.status(401).json(new apiResponse(200,"users not found",userlist))
    
    return res.status(200).json(new apiResponse(200,"Use list fetch successfully",userlist))
    
})


// exports.accountRequest = asyncHandler(async(req,res)=>{
    
// })