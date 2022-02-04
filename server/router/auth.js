const express = require("express") ;
const router = express.Router() ;
const bcrypt = require("bcryptjs") ;
const jwt = require("jsonwebtoken") ;
const authenticate = require("../middleware/authenticate");

require("../db/conn.js") ;
const User = require("../model/userSchema");

// router.get("/", (req,res) => {
//     res.send("Hello World from the server router") ;
// })


router.post("/register", async (req,res)=>{
    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        res.status(422).json({error : "plz fill the fields properly"}) ;
    }
    if( password != cpassword){
        res.status(422).json({error : "plz fill the fields properly"}) ;
    }

    try{
        const userExist = await User.findOne({email:email}) ;
        if(userExist){
             res.status(422).json({error : "Email already exist"}) ;
        }else if(password !== cpassword){
             res.status(422).json({error : "Passwords are not  matching"}) ;
        }

        const user = new User({name,email,phone, work, password, cpassword}) ;
        await user.save() ;
        
        res.status(201).json({message: "user registered successfully"}) ;


    }catch(err){
        console.log(err) ;
    }

    
})


// login
router.post("/signin", async (req,res) => {
    try{
        let token;
        const {email, password} = req.body;

        if(!email || !password){
            res.status(422).json({error : "plz fill the fields properly"}) ;
        }
        
        const userLogin = await User.findOne({email:email}) ;
        console.log(userLogin) ;
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password) ;

            if(!isMatch){
                res.status(422).json({error : "Invalid credentials"}) ;
           }
           
           
            token = await userLogin.generateAuthToken() ;
            console.log(token) ;
        
            res.cookie("jwtoken", token, {
                expires : new Date(Date.now() + 25892000000) ,
                httpOnly:true
            })


           
            
             res.status(201).json({message : "User signin successfully"}) ;
            
        }
        else{
             res.status(422).json({error : "Invalid credentials"}) ;
        }

        

    }catch(err){
        console.log(err) ;
    }
})


// about us  ka page 

router.get('/about', authenticate ,(req, res) => {
    // console.log(`Hello my About`);
    res.send(req.rootUser);
});

// get user data for contact us and home page 
router.get('/getdata', authenticate, (req, res) => {
    // console.log(`Hello my About`);
    res.send(req.rootUser);
});

// contact us page 

router.post('/contact', authenticate, async (req, res) => {
    try {

        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({ error: "plzz filled the contact form " });
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {
            
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({ message: "user Contact successfully" });

        }
        
    } catch (error) {
        console.log(error);
    }

});

// Logout  ka page 
router.get('/logout', (req, res) => {
    // console.log(`Hello my Logout Page`);
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send('User lOgout');
});


module.exports = router;
