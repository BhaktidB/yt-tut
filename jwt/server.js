const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes=require('./routes/authRoutes');
const {requireAuth,currentUser}=require('./middlewares/authMiddleware')
const port=3000

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/auth2';
mongoose.connect(dbURI)
.then(() => {console.log("db connected");
app.listen(port)})
.catch((err) => {
    console.error("Error connecting to the database:", err);
});


// routes
app.get('/*', currentUser);
app.get('/',(req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authRoutes)





// cookie
// app.get('/set-cookies',(req,res)=>{
//     // approach 1 of setting cookies
//     // res.setHeader('Set-Cookie','hello=world');

//     // approach 2
//     res.cookie('NewUser',false,{
//         maxAge:1000*60*60*24,
//         httpOnly:true
//     })

//     res.send('you got ur cookie')
// })

// app.get('/read-cookies',(req,res)=>{

//     const getCookies=req.cookies;
//     res.json(getCookies.NewUser)
// })

