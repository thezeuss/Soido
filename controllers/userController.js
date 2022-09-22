const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromises")
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const bigPromises = require("../middlewares/bigPromises");
const user = require("../models/user");
// const mailHelper = require("../utils/mailHelper");

exports.signup = BigPromise(async(req,res,next) => {
    const {name, phoneno, password,email} = req.body

    let result;
    if(req.files) {
        let file = req.files.photo;
          
        result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        })

       

    }
    if(!phoneno || !name){
        return next(new CustomError('Please enter your Number/Name', 400));

    }

    const user = await User.create({
        name,
        phoneno,
        password,
        email,
        // photo: {
        //     id: result.public_id,
        //     secure_url:result.secure_url
        // }
    })

    cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
    const {phoneno, password, email} = req.body;

    // check mandatory credentials are present or not
    if(!phoneno || !password) {
        return next(new CustomError('Please provide phone no and password!',400))
    }
    
    // if everything is present, try finding user based on credentials.
    const user = await User.findOne({phoneno}).select("+password");

    // user is not in DB
    if(!user) {
        return next(new CustomError('Email or Password does not match or exist.',400))
    }

    // user is present, so check for validations, match the password
    const isPassword = await user.isValidatedpassword(password);
     
    // if password is not right
    if(!isPassword) {
        return next(new CustomError('Email or Password does not match or exist.',400))
    }
    
    // everything is fine, send token 😁😁
    cookieToken(user, res)

    //log cookie data
    // console.log(req.cookieToken);


});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logout success",
    });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email})
    if(!user){
        return next(new CustomError('Email Not Found as Re'))
    }
    
    const forgotToken = user.getForgotPasswordToken()
    
    user.save({validateBeforeSave: false});

    const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`
    
    const message = `Copy paste this link in your URL and hit enter! \n\n ${myUrl}`
    
    try {
        await mailHelper({
            email: user.email,
            subject: "Soido - Reset Your Password!",
            message,
        });
        
        res.status(200).json({
            success: true,
            message: "Email sent successfully",
        })
    } catch (error) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined;

        await user.save({validateBeforeSave: false});

        return next(new CustomError(error.message, 500))


    }
})

exports.getLoggedInUserDetails = BigPromise( async (req, res, next) => {
     
   const user = await User.findById(req.user.id);

   res.status(200).json({
    success: true,
    user,
   });
});

exports.changePassword = BigPromise( async (req, res, next) => {

    const userId = req.user.id

    const user = await User.findById(userId).select("+password")

    const isCorrectOldPassword = await user.isValidatedpassword(req.body.oldPassword);

    if(!isCorrectOldPassword) {
        return next(new CustomError("Old password is incorrect!",400))

    }
    user.password = req.body.password;

    await user.save();

    cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const {phoneno, password, email, name} = req.body;

    // check mandatory credentials are present or not
    if(!name || !phoneno) {
        return next(new CustomError('Please provide name and phoneno for update process!',400))
    }
    const newData = {
        name: req.body.name,
        phoneno:req.body.phoneno,
        
    };

    const user = await  User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

exports.adminAlluser = BigPromise( async (req,res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success: "true",
        users,
    })
});

exports.admingetOneUser = BigPromise( async (req,res, next)=>{
    
    const user = await User.findById(req.params.id);
       
    if(!user) {
        next (new CustomError("No Users found", 400));
    }
    res.status(200).json({
        success: true,
        user
    })

})

exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
    const {phoneno, password, email, name} = req.body;

    // check mandatory credentials are present or not
    if(!name || !phoneno) {
        return next(new CustomError('Please provide name and phoneno for update process!',400))
    }
    const newData = {
        name: req.body.name,
        phoneno:req.body.phoneno,
        role:req.body.role,
        
    };
    const user = await  User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });



})

exports.adminDeleteOneUser = BigPromise(async (req,res,next)=> {
const user = await User.findById(req.params.id);

if(!user) {
    return next(new CustomError("No such User Found", 401));
}

await user.remove();

res.status(200).json({
    success: "true",
    message: "User Deleted!"
})
})


