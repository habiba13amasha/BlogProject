import { errorHandler } from "../utils/error.js"
import Post from "../models/postModel.js"
export const createPost =async(req,res,next)=>{
    if(!req.user.isAdmin){
       return next(errorHandler(403,"You are not allowed to create a post"))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,"Please provide all required fields"))
    }
    const slug=req.body.title.split(" ").join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'')

    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        slug,
        userId: req.user.id
    })

    try {
        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }
}

export const getPosts = async(req,res,next)=>{
    try{
       const startIndex=parseInt(req.query.startIndex)||0
       const limit=parseInt(req.query.limit)||9
       const sortDirection=parseInt(req.query.order ==="asc"?1:-1)
       const posts=await Post.find({
        ...(req.query.userId && {userId:req.query.userId}),
        ...(req.query.category && {category:req.query.category}),
        ...(req.query.slug && {slug:req.query.slug}),
        ...(req.query.postId && {_id:req.query.postId}),
        ...(req.query.searchTerm && {
            $or:[
                {title:{$regex:req.query.searchTerm,$options:"i"}},
                {content:{$regex:req.query.searchTerm,$options:"i"}}
            ],
        }),

       }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit)

       const totalPosts=await Post.countDocuments()
       const now=new Date()
       const oneMonthAge=new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
       )
       const oneMonthPosts=await Post.countDocuments({
        createdAt:{$gte:oneMonthAge}
       })
       res.status(200).json({posts,totalPosts,oneMonthPosts})
    }catch(error){
        next(error)
    }
}