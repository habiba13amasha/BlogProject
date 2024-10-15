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
      const token=jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const {password:pass,...rest}=validUser._doc; //to send validUser without password
      res.status(200).cookie("access-token", token,{httpOnly: true}).json(rest)
    }catch(error){
      next(error)
    }

}