const BigPromise = require("../middlewares/bigPromises")

exports.home = BigPromise( async(req,res)=>{
    res.status(200).json({
        success: true,
        greeting:"Hello from API"
    })
})

exports.homedummy = (req,res)=>{
    res.status(200).json({
        success: true,
        greeting:"Hello from dummy API"
    })
}