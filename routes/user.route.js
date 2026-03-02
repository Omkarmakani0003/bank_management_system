const express = require('express')
const registerController = require('../controllers/registerController')
const authenticationController = require('../controllers/authenticationController')
const userController = require('../controllers/userController')
const transactionController = require('../controllers/transactionController')
const router = express.Router()
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {auth} = require('../middleware/auth')

router.post('/register',registerController.register)
router.post('/login',authenticationController.userLogin)

router.use(auth('customer'))
router.post('/account-request',userController.accountRequest)
router.post('/transaction',transactionController.transaction)




module.exports = router
