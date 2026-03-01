const {asyncHandler} = require('../../utils/asyncHandler')
const {User} = require('../../models/user.model')
const {Account} = require('../../models/account.model')
const {Transaction} = require('../../models/transactions.model')
const {Ledger} = require('../../models/ledger.model')
const mongoose = require('mongoose')
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

    if(accountNumber.length !== 16) throw new apiError(401,"Invalid account number")

    const account = await Account.findOne({accountNo:accountNumber})
    if(!account) throw new apiError(404,"Account not found")

    isAccountStatus = ['activate','closed','frozen'] 
    if(isAccountStatus.includes(account.status)){
        throw new apiError(401,`This account is already ${account.status}`)
    }

    account.status = 'activate';
    account.save()

    return res.status(201).json(new apiResponse(201,"Account activated successfully",account))

})

exports.initBalance = asyncHandler(async(req,res)=>{
    const {accountNumber,balance,idempotency} = req.body
  
    if(!accountNumber || !balance || !idempotency) throw new apiError(401,"accountnumber, amount and idempotency key is required ") 
    if(balance <= 0) throw new apiError(401,"Enter valid amount")
    if(accountNumber.length !== 16) throw new apiError(401,"Invalid account number")

    const account = await Account.findOne({accountNo:accountNumber})
    if(!account) throw new apiError(404,"Account not found")

    isAccountStatus = ['pending','closed','frozen']    
    if(isAccountStatus.includes(account.status)){
        throw new apiError(401,`This account is in ${account.status} mode, you cant perform any activities`)
    }

    const isTransactionExist = await Transaction.findOne({idempotency:idempotency})
 
    if(isTransactionExist){
        if(isTransactionExist.status == 'pending') return res.status(200).json(new apiResponse(200,`transaction is pending`))
        if(isTransactionExist.status == 'success') return res.status(200).json(new apiResponse(200,`transaction success`))
        if(isTransactionExist.status == 'faild') return res.status(200).json(new apiResponse(200,`transaction faild`))      
    } 

    let transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    const systemAccount = await Account.findOne({userId:req.user._id})

    transaction = (await Transaction.create([{
        idempotency: idempotency,
        senderId: systemAccount._id,
        receiverId: account._id,
        amount: balance,
        status:'pending'
    }],{session}))[0]
  
   const debit = await Ledger.create([{
        transactionId: transaction._id,
        accountId: systemAccount._id,
        amount:balance,
        status:'debit'
    }],{session})

    await Ledger.create([{
        transactionId: transaction._id,
        accountId: account._id,
        amount:balance,
        status:'credit'
    }],{session})

    await Transaction.findByIdAndUpdate({_id:transaction._id},{status:"success"},{ session })    

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json(new apiResponse(201,`${balance} is creditad successfully`))
 
})