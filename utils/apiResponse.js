class apiResponse {
    constructor(statusCode,message="success",data=[]){
        this.statusCode = statusCode
        this.success = statusCode < 400
        this.message = message
        this.data = data
    }
}

module.exports = apiResponse