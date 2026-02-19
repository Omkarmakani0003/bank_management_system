const apiError = require("./apiError")
const apiResponse = require("./apiResponse")

exports.globleErrorHandler = (error,req,res,next)=>{
    if(!error) return 
    if(error instanceof apiError){
         return res.status(error.status).json(new apiResponse(error.status,error.message,error.data))
    }else{
        return res.status(500).json(new apiResponse(500,error._message??error.message??"Internal Server Error"))
    }
}