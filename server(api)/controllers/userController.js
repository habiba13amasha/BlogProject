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

 export const deleteUser =async (req, res,next) => {
  if(req.user.id !== req.params.userId) {
     return next(errorHandler(403,"You are not allowed to delete this user"))
  }
  try {
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json("User has been deleted")
  } catch (error) {
    next(error)
  }
 }

 export const signOut=(req, res,next) => {
   try{
    res.clearCookie("access_token").status(200).json("User has been signOut")
   }catch(error) {
     next(error)
   }

 }

 export const getUsers=async(req,res,next)=>{
  if(!req.user.isAdmin){
     return next(errorHandler(403,"You are not allowed to see all users"))
  }

  try {
    const startIndex=parseInt(req.query.startIndex)||0  //startIndex: يمثل الفهرس الذي نبدأ منه جلب المنشورات
    const limit=parseInt(req.query.limit)||9  //limit: يمثل الحد الأقصى لعدد المنشورات التي سيتم جلبها في كل طلب.
    const sortDirection=parseInt(req.query.order ==="asc"?1:-1)
    const users=await User.find()
    .sort({updatedAt:sortDirection}).skip(startIndex).limit(limit)

    const usersWithoutPassword=users.map((user)=>{
      const{password,...rest}=user._doc
      return rest
    })

    const totalUsers=await User.countDocuments()   //totalPosts: يحسب العدد الإجمالي لجميع المنشورات في قاعدة البيانات باستخدام 
       const now=new Date()
       const oneMonthAge=new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
       )
       const oneMonthUsers=await User.countDocuments({  //oneMonthPosts: يحسب عدد المنشورات التي تم إنشاؤها في آخر شهر.
        createdAt:{$gte:oneMonthAge}
       })
       res.status(200).json({users:usersWithoutPassword,totalUsers,oneMonthUsers})
  } catch (error) {
    next(error)
  }
 }


 