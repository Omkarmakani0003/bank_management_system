const mongoose = require('mongoose')
const apiError = require('../utils/apiError')

const ledgerSchema = new mongoose.Schema({

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: true,
        index: true,
        immutable: true
    },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true,
        immutable: true
    },
    
    amount:{
        type: Number,
        required: true,
        immutable: true
    },

    status:{
        type: String,
        enum:['credit','debit'],
        required: true,
        index: true,
        immutable: true
    }
},
 {timestamps : true}
)

ledgerSchema.index({accountId: 1, status: 1})

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
