// const { error } = require('console')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleErrors = (error) => {
    console.log(error.message, error.code)
    const errors = {
        email: '',
        password: ''
    }

    // login incorrect email
    if(error.message==='incorrect email'){
         errors.email='Email does not exist'
         return errors
    }

    // login incorrect password
    if(error.message==='incorrect password'){
        errors.password='Incorrect password'
        return errors
   }

    // validate error code i.e. unique email error no duplicate
    if (error.code === 11000) {
        errors.email = 'User already exists'
        return errors
    }

    // validate error message
    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({
            properties
        }) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

const maxAge = 24 * 60 * 60 * 3;
const createToken = (id) => {
    return jwt.sign({
        id
    }, 'secretkey', {
        expiresIn: maxAge
    })
}


//get methods 

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/')
    // res.render('home')
}


// post methods 

module.exports.login_post = async (req, res) => {
    const {
        email,
        password
    } = req.body
    // console.log(email, password)
    try {
        const user=await User.login(email,password)
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge*1000})
        res.status(200).json({user:user._id})
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});    
    }
 
}

module.exports.signup_post = async (req, res) => {
    const {
        email,
        password
    } = req.body

    try {
        const user = await User.create({
            email,
            password
        });

        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge*1000})
        
        res.status(201).json({user:user._id})

    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}