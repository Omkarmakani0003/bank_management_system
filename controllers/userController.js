const {User} = require('../models/user.model')
const {Account} = require('../models/account.model')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {Transaction} = require('../models/transactions.model')
const {Ledger} = require('../models/ledger.model')

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

exports.balance = asyncHandler(async(req,res)=>{
    const account = await Account.findOne({userId:req.user._id})
    const CurrentBalance = await account.getBalance();
    console.log(CurrentBalance)
    return res.status(200).json(new apiResponse(200,`Your current balance is ${CurrentBalance}`,{'Balance':CurrentBalance}))  
})

exports.statement = asyncHandler(async(req,res)=>{

})

