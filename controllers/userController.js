const {User} = require('../models/user.model')
const {Account} = require('../models/account.model')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')


exports.accountRequest = asyncHandler(async(req,res)=>{

    const accountNo =  parseInt("311010311" + Math.floor(Math.random() * 999999) * 10)
    
    const AccountAlreadyCreated = await Account.findById(req.user._id)

    if(AccountAlreadyCreated) throw new apiError(401,"you have already an account")
   
    await Account.create({
        accountNo : accountNo,
        userId : req.user._id
    })

    return res.status(201).json(new apiResponse(201,"Accout request sent successfully"))  
})

