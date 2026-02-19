const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const {asyncHandler} = require('../utils/asyncHandler')

exports.connection = asyncHandler(
  ()=> {
      mongoose.connect(process.env.DBURL)
     .then(()=>{ console.log('db connected successfully') })
     .catch(()=>{ console.log('Something went wrong')  })
  }
)
