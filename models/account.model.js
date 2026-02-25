const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({

    accountNo: {
        type: Number,
        require: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    balance:{
        type: Number,
        default : 0
    },
    opningDate:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: String,
        enum:["pending","activate","closed","frozen"],
        default: "pending"
    }
},
 {timestamps : true}
)

module.exports.Account = mongoose.model("account",accountSchema)
