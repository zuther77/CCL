var express=require('express')
var router=express.Router();
var sharp = require("sharp")

router.get("/",function(req,res,next){
    res.send("API working")
})

module.exports=router;