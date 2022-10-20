const express = require("express");
require("dotenv").config();
const app = express();
var morgan = require('morgan');
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")

// for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml"); 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));


// 
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));


//morgan middleware
app.use(morgan("tiny"));
// app.use(morgan(':id :method :url :response-time'))

// import all routes
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");

//middlewares of all routes
app.use("/api/v1", home);
app.use("/api/v1",user);
app.use("/api/v1", product);

//exporting app js
module.exports  = app;