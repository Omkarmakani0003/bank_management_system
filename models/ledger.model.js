const mongoose = require('mongoose')
const apiError = require('../utils/apiError')

const ledgerSchema = new mongoose.Schema({

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        require: true,
        index: true,
    },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        require: true,
        index: true,
    },
    
    amount:{
        type: Number,
        require: true
    },

    status:{
        type: String,
        enum:['credit','debit'],
        require: true,
        index: true,
    }
},
 {timestamps : true}
)


function ledgerModification(){
    throw new apiError(400,"you can not modify ledgers")
}

ledgerSchema.pre('findOneAndUpdate',ledgerModification)
ledgerSchema.pre('updateOne',ledgerModification)
ledgerSchema.pre('updateMany',ledgerModification)
ledgerSchema.pre('deleteOne',ledgerModification)
ledgerSchema.pre('deleteMany',ledgerModification)
ledgerSchema.pre('remove',ledgerModification)


module.exports.Ledger = mongoose.model("ledger",ledgerSchema)
