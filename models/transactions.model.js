const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({

    idempotency : {
        type: String,
        require: true,
        index: true,
        unique : true
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        index: true,
        required: true,
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        index: true,
        required: true,
    },
    amount:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum:['pending','success','faild'],
        required: true,
        default: 'pending'
    }
},
 {timestamps : true}
)

module.exports.Transaction = mongoose.model("transaction",transactionSchema)
