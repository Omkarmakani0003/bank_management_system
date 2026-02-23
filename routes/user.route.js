const express = require('express')
const registerController = require('../controllers/registerController')
const router = express.Router()
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {auth} = require('../middleware/auth')

router.post('/register',registerController.register)

// router.get('/test',auth('user'),async(req,res)=>{
//     return res.status(200).json(new apiResponse(200,req.user))
// })




module.exports = router
