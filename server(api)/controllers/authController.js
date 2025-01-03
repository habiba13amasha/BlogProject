// controllers/authController.js
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken"
export const signup = async (req, res, next) => { 
    const { userName, email, password } = req.body;

    console.log('Signup request body:', req.body); // للتحقق من البيانات المستقبلة

    if(!userName || !email || !password || userName === "" || email === "" || password === ""){
        return next(errorHandler(400, "All Fields Required")); // إضافة return
    }

    const hashedPassword = bcryptjs.hashSync(password, 10); // لتأمين كلمة المرور
    const newUser = new User({
        userName,
        email,
        password: hashedPassword
    });

   try{
        await newUser.save(); // حفظ المستخدم في قاعدة البيانات
        res.json({ message: "SignUp successful" });
   } catch(error){
        next(error); // تمرير الخطأ إلى Error Handling Middleware
   }
};

export const signin=async(req, res, next)=>{
    const { email, password } = req.body;
    if(!email ||  !password || email === ""  || password === ""){
        return next(errorHandler(400, "All Fields Required")); // إضافة return
    }

    try{
      const validUser=await User.findOne({ email});
      if(!validUser){
        return next(errorHandler(404, " User not found"));
      }
      const validPassword=bcryptjs.compareSync(password,validUser.password);
      if(!validPassword){
        return next(errorHandler(400, "Invalid Password"));
      }
      const token=jwt.sign({ id: validUser._id , isAdmin:validUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const {password:pass,...rest}=validUser._doc; //to send validUser without password
      res.status(200).cookie("access-token", token,{httpOnly: true}).json(rest)
    }catch(error){
      next(error)
    }

}


export const google=async(req,res,next)=>{
  const {name,email,googlePhotoUrl}=req.body;
   
  try{
     const user=await User.findOne({email})
     if(user){
       const token=jwt.sign({ id: user._id, isAdmin:user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
       const {password:pass,...rest}=user._doc; //to send user without password
       res.status(200).cookie("access-token", token,{httpOnly: true}).json(rest)
      }else{
        const generatedPssword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser=new User({
          username:name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
          email,
          password:hashedPassword,
          profilePhoto:googlePhotoUrl
        })
        await newUser.save()
        const token=jwt.sign({ id: user._id , isAdmin:newUser.isAdmin}, process.env.JWT_SECRET, { expiresIn: '1d' });
        const {password:pass,...rest}=user._doc; //to send user without password
        res.status(200).cookie("access-token", token,{httpOnly: true}).json(rest)
      }
  }catch(error){
    next(error)
  }


}