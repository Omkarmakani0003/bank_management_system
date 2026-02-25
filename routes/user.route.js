const express = require('express')
const registerController = require('../controllers/registerController')
const userController = require('../controllers/userController')
const router = express.Router()
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {auth} = require('../middleware/auth')

router.use(auth('customer'))
router.post('/register',registerController.register)
router.post('/account-request',userController.accountRequest)




module.exports = router
