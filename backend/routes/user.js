const express = require("express");

const router = express.Router();

router.get('/',(req,res)=>{
    res.send("Hello form user home page ")
})
router.get('/signup',(req,res)=>{
    res.send("Hello form user signup ")
})
router.get('/login',(req,res)=>{
    res.send("Hello form user login ")
})

module.exports=router;

