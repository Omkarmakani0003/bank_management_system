const express = require('express')
const authenticationController = require('../controllers/authenticationController')
const adminController = require('../controllers/adminControllers/adminController')
const {asyncHandler} = require('../utils/asyncHandler')
const apiResponse = require('../utils/apiResponse')
const apiError = require('../utils/apiError')
const {auth} = require('../middleware/auth')
const router = express.Router()

router.post('/login',authenticationController.adminLogin)

router.use(auth('admin'))
router.get('/user-list',adminController.userlist)
router.get('/requests',adminController.accountRequest)
router.put('/accept-requests',adminController.acceptRequest)
router.post('/init-balance',adminController.initBalance)




module.exports = router
