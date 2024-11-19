import { Alert, Button, Textarea } from "flowbite-react"
import { useState } from "react"
import{useSelector} from "react-redux"
import { Link } from "react-router-dom"
export default function CommentSection({postId}) {
  const [comment,setComment]=useState("")
  const[commentError,setCommentError]=useState(null)
  const {currentUser}=useSelector(state=>state.user)
  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(comment.length>200){
      alert("Comment cannot exceed 200 characters")
      return;
    }
    try {
      const res=await fetch("/api/comment/create-comment",{
        method: "POST",
        credentials: 'include',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({content:comment,postId,userId:currentUser._id})
      })
      const data=await res.json()
      if(res.ok){
        setComment("")
        setCommentError(null)
      }
    } catch (error) {
      setCommentError(error.message)
    }
   
  }
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser?
      (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p>Signed in as:</p>
          <img src={currentUser.profilePhoto} className="h-5 w-5 object-cover rounded-full"/>
          <Link to={"/dashboard?tab=profile"} className="text-xs text-cyan-600 hover:underline">
            @{currentUser.userName}
          </Link>
        </div>
      )
      :
      (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          <p>You must be signed in to comment.</p>
          <Link to="/sign-in" className=" text-blue-600 hover:underline">Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
          <Textarea placeholder="Add a comment" rows={3} maxLength="200" value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
          <div className="flex justify-between items-center mt-5">
           <p className="text-gray-500 text-xs">{200 - comment.length} character remaining</p>
           <Button outLine gradientDuoTone="purpleToBlue" type="submit">Submit</Button>
          </div>
          {commentError&&(
            <Alert color="failure" className="mt-5">{commentError}</Alert>
          )}
        </form>
        
        
      )}
    </div>
  )
}
