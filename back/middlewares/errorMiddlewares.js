class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message||"internal server error";
    err.statusCode=err.statusCode||500;

    // console.log(err);--to find out err codes

    if(err.code ===11000){
        const statusCode=400;
        const message=`duplicate field value entered`
        err = new ErrorHandler(err.message,err.statusCode)
    }

    if(err.name ==="JsonWebTokenError"){
        const statusCode=400;
        const message=`json web token is invalid .try again`
        err = new ErrorHandler(err.message,err.statusCode)
    }

    if(err.name==="TokenExpiredError"){
        const statusCode=400;
        const message=`json web token is invalid .try again`
        err = new ErrorHandler(err.message,err.statusCode)
    }

    if(err.name =="CastError"){
        const statusCode=400;
        const message=`Resouurce not found..`
        err = new ErrorHandler(err.message,err.statusCode)
    }

    const errorMessage=err.errors 
    ? Object.values(err.errors)
    .map(error=> error.message)
    .join("")
    :err.message;


    return res.status(err.statusCode).json({
        success:false,
        message:errorMessage,
    });
};

export default ErrorHandler; 