const mongoose = require('mongoose')
const {Account} = require('../models/account.model')
const {Transaction} = require('../models/transactions.model')
const {Ledger} = require('../models/ledger.model')

const accountSchema = new mongoose.Schema({

    accountNo: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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

accountSchema.methods.getBalance = async function(){
     const balance = await Ledger.aggregate([
        {$match:{'accountId':this._id}},
        {
            $group:{
                _id:null,
                credit:{
                    $sum:{
                        $cond:[
                            {$eq:["$status","credit"]},
                            "$amount",
                            0
                        ],
   
                    }
                },
                debit:{
                    $sum:{
                        $cond:[
                            {$eq:["$status","debit"]},
                            "$amount",
                            0
                        ],
   
                    }
                }
            }  
        },
        {
            $project:{
                '_id': 0,
                'balance': {$subtract:["$credit","$debit"]}
            }
        }
     ])

    if(!balance || balance.length == 0){
        return 0
    }

    return balance[0].balance
}


module.exports.Account = mongoose.model("account",accountSchema)
 