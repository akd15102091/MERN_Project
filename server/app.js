const dotenv = require("dotenv")
const mongoose = require("mongoose") ;
const express = require("express") ;
const app = express() ;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

dotenv.config({path:"./config.env"}) ;

require("./db/conn.js") ;
app.use(express.json()) ;

app.use(require("./router/auth")) ;

const PORT = process.env.PORT ;



// app.get("/about",(req,res) => {
//     console.log("Hello my about") ;
//     res.send("Hello About from the server") ;
// })

// app.get("/contact", (req,res) => {
//     res.send("Hello contact from the server") ;
// })

app.get("/signin", (req,res) => {
    res.send("Hello signin from the server") ;
})

app.get("/signup", (req,res) => {
    res.send("Hello signup from the server") ;
})

app.listen(PORT, ()=>{
    console.log(`server is running at ${PORT} port`) ;
})