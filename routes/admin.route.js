const express = require('express')
const authenticationController = require('../controllers/authenticationController')
const adminController = require('../controllers/adminControllers/adminController')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {auth} = require('../middleware/auth')
const router = express.Router()

router.post('/login',authenticationController.login)

// router.get('/test',auth('admin'),async(req,res)=>{
//     return res.status(200).json(new apiResponse(200,req.user))
// })
router.use(auth('admin'))
router.get('/user-list',adminController.userlist)

// router.post('account-request',)


module.exports = router
