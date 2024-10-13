// controllers/authController.js
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

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
