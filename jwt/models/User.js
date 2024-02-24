const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Enter valid email']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength:[6,'Enter minimum 6 characters']
    }
})

// hashing password
// pre post etc are mongoose hooks
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    
    next();
})

// static method to login user
userSchema.statics.login=async function(email,password){
    const user =await this.findOne({email:email})
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }throw Error('incorrect password')
    }throw Error('incorrect email')
}

const User=mongoose.model('user',userSchema);
module.exports=User;