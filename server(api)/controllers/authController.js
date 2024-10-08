import User from "../models/userModel.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
export const signup =async (req,res,next) => { 
    const {userName,email,password}=req.body

    if(!userName || !email || !password || userName==="" || email==="" || password===""){
        next(errorHandler(400,"All Fields Require"))
    }

    const hashedPassword=bcryptjs.hashSync(password,10) //to secure password
    const newUser= new User({
        userName,
        email,
        password:hashedPassword
    })

   try{
    await newUser.save() //save user in database
    res.json({message:"SignUp successful"})
   }catch(error){
     next(error) // to implement (Error Handling Middleware) In case an error occurs ;يجب تسجيل جميع الـ Routes قبل تسجيل Error Handling Middleware. 
   }
 };

 