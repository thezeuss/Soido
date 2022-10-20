const express = require("express");
const { addProduct, getAllProduct, deleteMyProduct, adminGetAllProduct, getOneProduct, getMyUploads, updateMyProduct, adminGetOneProduct,adminDeleteProduct} = require("../controllers/productController");
const router = express.Router();
const { isLoggedIn, customRole, currentUserID} = require("../middlewares/usermiddleware");
const jwt = require("jsonwebtoken")

//user routes
router.route("/product/add").post(isLoggedIn,addProduct);
router.route("/products").get(isLoggedIn,getAllProduct);
router.route("/products/:id").get(isLoggedIn,getOneProduct)
router.route("/products/:id").put(isLoggedIn,currentUserID,updateMyProduct);
router.route("/products/:id").delete(isLoggedIn,currentUserID,deleteMyProduct);
router.route(`/myuploads`).get(isLoggedIn,currentUserID,getMyUploads);

//admin
router.route("/admin/products").get(isLoggedIn, customRole("admin"), adminGetAllProduct);
router.route("/admin/products/:id").get(isLoggedIn, customRole("admin"), adminGetOneProduct);
router.route("/admin/products/:id").delete(isLoggedIn, customRole("admin"), adminDeleteProduct);




module.exports = router;