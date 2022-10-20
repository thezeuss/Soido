const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromises")
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {

    //grab the token
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ","");

    if(!token) {
        return next(new CustomError("Login first to access this page", 401))
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET);

    const currentUserID = decoded.id;
    req.user = await User.findById(decoded.id);

    next();
});

exports.customRole = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new CustomError("You are not allowed for this resource", 403))
        }
        next();
    }

     
}

exports.currentUserID = BigPromise(async (req, res, next) => { 
    //grab the token
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ","");

    if(!token) {
        return next(new CustomError("Login first to access this page", 401))
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET);

    const currentUserID = decoded.id;

    req.header = currentUserID;
    console.log(req.header);
    next();


    // return currentUserID;
      
 })

    
