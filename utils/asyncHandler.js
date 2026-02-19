
/*
* first method
*/

exports.asyncHandler = (requestHandle) => async( req,res,next )=>{
    Promise.resolve(requestHandle(req,res,next)).catch((error)=>{
        next(error)
    })
}


/*
* second method
*/

// exports.asyncHandler = (requestHandle) => async( req,res,next )=>{
//     try{
//         await requestHandle(req,res,next)
//     }catch(error){
//         return res.status(401).json({success:false,message:error.message || "Something went wrong"})
//     }
// }


/*
* third method
*/

// exports.asyncHandler = (requestHandle) => async( req,res,next )=>{
//    requestHandle(req,res,next).catch((error)=>{
//      return res.status(401).json({success:false,message:error.message || "Something went wrong"})
//    })
// }