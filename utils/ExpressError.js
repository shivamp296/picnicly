class ExpressError extends Error{
    constructor(message,statusCode){
        super();   //for calling instructor error
        this.message=message;
        this.statusCode=statusCode;
    }
}

module.exports=ExpressError;