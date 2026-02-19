class apiError extends Error{
    constructor(statusCode=400,message="Somethingwent wrong",error=null,data=[],stack=null){
        super(message)
        this.status = statusCode
        this.error = error
        this.data = data
        this.success = false
        if(!stack){
            Error.captureStackTrace(this,this.constructor)
        }else{
            this.stack = stack
        }
    }
}

module.exports = apiError