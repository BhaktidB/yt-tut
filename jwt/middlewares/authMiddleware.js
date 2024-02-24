const jwt=require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()

// protect routes
const requireAuth=(req,res,next)=>{
    const token =req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decodedToken)=>{
            if(err){
                console.log(err)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

// check current user
const currentUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if (err) {
          res.locals.loggedUser = null;
          next();
        } else {
          let loggedUser = await User.findById(decodedToken.id);
          res.locals.loggedUser = loggedUser;
          next();
        }
      });
    } else {
      res.locals.loggedUser = null;
      next();
    }
  };

module.exports={requireAuth,currentUser};