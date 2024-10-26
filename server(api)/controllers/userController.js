import { errorHandler } from "../utils/error.js";
import  bcryptjs from 'bcryptjs'
import User from "../models/userModel.js"
export const test =  (req, res) => {
    res.json({ message: 'Api is working' });
 }

 export const updateUser=async(req, res,next) => {
   if(req.user.id !== req.params.userId){
       return next(errorHandler(403,"You are not allowed to update this user"))
   }
   if(req.body.password){
     if(req.body.password.length<6){
         return next(errorHandler(400,"Password must be at least 6 characters"))
     }
     req.body.password = await bcryptjs.hash(req.body.password, 10)
   }
   if(req.body.userName){
      if(req.body.userName<7 && req.body.userName >20){
         return next(errorHandler(400,"Username must be between 7 and 20 characters"))
      }
      if(req.body.userName.includes(" ")){
        return next(errorHandler(400,"Username can`t contain spaces"))
      }
      if(req.body.userName !=req.body.userName.toLowerCase){
        return next(errorHandler(400,"Username can't contain uppercase letters"))
      }
      if(req.body.userName.match(/^[a-zA-Z0-9]+$/)){
         return next (errorHandler(400,"UserName can only contain letters and numbers"));
      }
   }
   try{
     const updateUser = await User.findByIdAndUpdate(req.params.userId,{ 
      $set:{
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        updatedAt: Date.now(),
        profilePhoto: req.body.profilePhoto
      }}
      , {new: true, runValidators: true})
      const{password,...rest}=updateUser._doc
      res.status(200).json(rest)
   }catch(error){
     next(error)
   }
 }
 