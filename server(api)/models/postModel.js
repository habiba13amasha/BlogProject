import mongoose from 'mongoose';

const postSchema=new mongoose.Schema({
    userId:{
      type:String,
      required:true
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1542435503-956c469947f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsb2d8ZW58MHx8MHx8fDA%3D"
    },
    category:{
        type:String,
        default:"uncatergorized"
    },
    slug:{
      type:String,
      required:true,
      unique:true
    }
},{timestamps:true})

const Post=mongoose.model('Post',postSchema)

export default Post;