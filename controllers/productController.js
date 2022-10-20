const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromises");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");
const user = require("../models/user");
const userToken = require("../middlewares/usermiddleware");
const jwt = require("jsonwebtoken");

exports.addProduct = BigPromise(async (req, res, next) => {
  // images

  let imageArray = [];

  if (!req.files) {
    return next(new CustomError("images are required", 401));
  }

  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "soidoCattle",
        }
      );

      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalcountProduct = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;
  const filteredProductNumber = products.length;

  //products.limit().skip()

  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone(); //took 2 days to debug!!!!!!!!!!!!!!!!!!!!!!1

  res.status(200).json({
    success: true,
    products,
    filteredProductNumber,
    totalcountProduct,
  });
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found with this id", 401));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getMyUploads = BigPromise(async (req,res, next) => {
  
  // const token = req.cookies.token || req.header("Authorization").replace("Bearer ","");

  //   if(!token) {
  //       return next(new CustomError("Login first to access this page", 401))
  //   }

  //   const decoded = jwt.verify( token, process.env.JWT_SECRET);

  //   const currentUserID = decoded.id;


  const products = await Product.find({user:req.header});

  if (!products){
    res.status(200).json({
      message: "There are no cattles uploaded by you for Selling!"
    })
  }

  const myUploadedprodNo = products.length;

  res.status(200).json({
   success: true,
   products,
   myUploadedprodNo
  });
});

exports.updateMyProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
   if (!product) {
  return next(new CustomError("No product found with this id", 401));}
 
  let imagesArray = [];
  
  if (req.files) {
    //destroy the existing image
    for (let index = 0; index < product.photos.length; index++) {
      const res = await cloudinary.v2.uploader.destroy(
        product.photos[index].id
      );
    }

    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "soidoCattle", //folder name -> .env
        }
      );

      imagesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imagesArray;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });



  
});

exports.deleteMyProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  //uploader can only delete..

  if (!product) {
    return next(new CustomError("No product found with this id", 401));
  }
  
  if(product.user == req.header)
  
  {//destroy the existing image
  for (let index = 0; index < product.photos.length; index++) {
    const res = await cloudinary.v2.uploader.destroy(product.photos[index].id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: " Your Product was deleted !",
  });}
  else{
    res.status(403).json({
      success: false,
      message: " Sorry! No authority to perform this action !",
    });
  }
});

exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
  const products = await Product.find();

  if (!products){
    res.status(200).json({
      message: "There are no cattles uploaded yet by any user!"
    })
  }

  res.status(200).json({
    success: true,
    products
  })
});

exports.adminGetOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found with this id", 401));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminDeleteProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  //uploader can only delete..

  if (!product) {
    return next(new CustomError("No product found with this id", 401));
  }
  
 //destroy the existing image
  for (let index = 0; index < product.photos.length; index++) {
    const res = await cloudinary.v2.uploader.destroy(product.photos[index].id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: " Your Product was deleted !",
  });
  
});

