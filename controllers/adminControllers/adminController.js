const {asyncHandler} = require('../../utils/asyncHandler')
const {User} = require('../../models/user.model')
const {Account} = require('../../models/account.model')
const apiResponse = require('../../utils/apiResponse')
const apiError = require('../../utils/apiError')

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

    if(!(userlist.length > 0)) return res.status(404).json(new apiResponse(200,"users not found",userlist))
    
    return res.status(200).json(new apiResponse(200,"Use list fetch successfully",userlist))
    
})


exports.accountRequest = asyncHandler(async(req,res)=>{
    const requests = await Account.find({status :'pending'})
    if(!requests.length > 0) return res.status(200).json(new apiResponse(200,"Requests not found",requests))
    return res.status(200).json(new apiResponse(200,"Request fetch successfully",requests))
}) 

exports.acceptRequest = asyncHandler(async(req,res)=>{

    const accountNumber = req.body.accountNumber
    if(!accountNumber) throw new apiError(401,"Please enter the account numbers")

    const account = await Account.findOne({accountNo:accountNumber})
    
    if(account.status == 'activate'){
        throw new apiError(401,"This account is already activate")
    }else if(account.status == 'closed'){
        throw new apiError(401,"This account is closed")
    }else if(account.status == 'frozen') {
        throw new apiError(401,"This account is frozen")
    }

    account.status = 'activate';
    account.save()

    return res.status(201).json(new apiResponse(201,"Account activated successfully",account))

})

exports.initBalance = asyncHandler(async(req,res)=>{
    
})