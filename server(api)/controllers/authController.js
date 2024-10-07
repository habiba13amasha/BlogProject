import User from "../models/userModel.js"
import bcryptjs from "bcryptjs"
export const signup =async (req,res) => { 
    const {userName,email,password}=req.body

    if(!userName || !email || !password || userName==="" || email==="" || password===""){
        return res.status(400).json({message:"All Fields Require"})
    }

    const hashedPassword=bcryptjs.hashSync(password,10) //to secure password
    const newUser= new User({
        userName,
        email,
        password:hashedPassword
    })

   try{
    await newUser.save()
    res.json({message:"SignUp successful"})
   }catch(error){
     res.status(500).json({message:error.message})
   }
 };

 