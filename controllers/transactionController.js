const {User} = require('../models/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {Account} = require('../models/account.model')
const {Transaction} = require('../models/transactions.model')
const {Ledger} = require('../models/ledger.model')
const mongoose = require('mongoose')


exports.transaction = asyncHandler(async(req,res)=>{
    const {toAccount,idempotency,amount} = req.body

    if(!toAccount || !idempotency || !amount){
        throw new apiError(400,"All fields are required")
    }

    if(amount <= 0){
        throw new apiError(400,"Enter a valid amount")
    }

//  check transaction is exist or not (any status: pending,succes,feild)
    const idempotencyExist = await Transaction.findOne({idempotency:idempotency})
    if(idempotencyExist){
        return res.status(200).json(new apiResponse(200,`Your transation is ${idempotencyExist.status}`))
    }

//  Check from account is exist or not
    const isFromAccountExist = await Account.findOne({userId : req.user._id})
    if(!isFromAccountExist){
        throw new apiError(400,"From account not found")
    }

//  Check to account is exist or not
    const isToAccountExist = await Account.findOne({accountNo:toAccount})
    if(!isToAccountExist){
        throw new apiError(400,"To account not found")
    }
  
    
//  Check to account Activation
    if(isFromAccountExist.status !== 'activate' || isToAccountExist.status !== 'activate'){
        throw new apiError(400,`Both accounts must be activated`)
    }

    if(isFromAccountExist._id === isToAccountExist._id){
        throw new apiError(400,`Something went wrong, enter valid account no.`)
    }

//  Check to sender balance
    const balance = await isFromAccountExist.getBalance()

    if(balance[0].balance < amount) {
       throw new apiError(400,"You have not a sufficient balance",balance)
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = (await Transaction.create([{
        idempotency: idempotency,
        senderId: isFromAccountExist._id,
        receiverId: isToAccountExist._id,
        amount: amount,
        status: 'pending'
    }],{session}))[0]

    await Ledger.create([{
        transactionId: transaction._id,
        accountId: isToAccountExist._id,
        amount: amount,
        status: 'credit'
    }],{session})

    await Ledger.create([{
        transactionId: transaction._id,
        accountId: isFromAccountExist._id,
        amount: amount,
        status: 'debit'
    }],{session})
    

   await Transaction.findOneAndUpdate({_id:transaction._id},{status: 'success'},{session})

   session.commitTransaction()
   session.endSession()

   return res.status(201).json(new apiResponse(201,"Transaction success"))

}) 