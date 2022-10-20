const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name!'],
        maxlength: [40, 'Name should be under 40 characters.']
    },

    phoneno: {
        type: Number,
        unique: [true, "This phoneno is already registered!"],
        min: 1000000000,
        max: 9999999999
        // validate: [validator.Number, 'Please enter correct number!']

    },

    email: {
        type: String,
        unique: true,
        // required: [true, 'Please provide a name!'],
        validate: [validator.isEmail, 'Please enter email in correct format'],
        // unique: true,
        index:true,
        sparse:true},
        // unique: true},

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'password should be atleast 6 char'],
        select: false
    },

    role: {
        type: String,
        default: 'user'
    },

    state: {
          type: String,
        //   required: [true, "Please provide your State name!"]
    },
    photo: {
        id: {
            type: String,
            // required: true
        },
        secure_url: {
            type: String,
            // required:true

        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now,

    }


});

// encrypt password before save, only when password field is touched
userSchema.pre('save', async function(next) {
if(!this.isModified("password")){
        return next() ;
    }
    this.password = await bcrypt.hash(this.password, 10 )
});


//validate the password with passed on user password
userSchema.methods.isValidatedpassword = async function(usersendPassword){
    return await bcrypt.compare(usersendPassword, this.password);
};

//create and return jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
};
// generate forgot password token (string)
userSchema.methods.getForgotPasswordToken = function () {
    // generate a long and randomg string
    const forgotToken = crypto.randomBytes(20).toString("hex");
  
    // getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");
  
    //time of token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  
    return forgotToken;}
//


module.exports = mongoose.model('User',userSchema)