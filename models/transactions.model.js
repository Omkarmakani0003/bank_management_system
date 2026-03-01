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
        require: true,
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        index: true,
        require: true,
    },
    amount:{
        type: Number,
        require: true
    },
    status:{
        type: String,
        enum:['pending','success','faild'],
        require: true,
        default: 'pending'
    }
},
 {timestamps : true}
)

module.exports.Transaction = mongoose.model("transaction",transactionSchema)
