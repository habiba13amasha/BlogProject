import { useEffect, useState } from "react"
import moment from "moment"
import {FaThumpsUp} from "react-icons/fa"
import { useSelector } from "react-redux"
import{Button, Textarea} from "flowbite-react"
export default function Comment({comment,onLike,onEdit}) {
  const {currentUser}=useSelector(state=>state.user)
  const [user,setUser]=useState({})
  const[isEditing,setIsEditing]=useState(false)
  const [editedContent,setEditedContent]=useState(comment.content)
    useEffect(()=>{
      const getUser=async()=>{
        try{
          const res=await fetch(`/api/user/${comment.userId}`)
          const data=await res.json()
          if(res.ok){
            setUser(data)
          }
        }catch(error){
            console.log(error.message);
        }
      }
      getUser()
    },[comment])

    const handleEdit=async()=>{
      setIsEditing(true)
      setEditedContent(comment.content)
      
    }
    const handleSave=async()=>{
      try {
        const res=await fetch(`/api/comment/editComment/${comment._id}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({content: editedContent})
        })
        const data=await res.json()
        if(res.ok){
          setIsEditing(false)
          onEdit(comment,editedContent)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="mr-3 flex-shrink-0">
        <img src={user.profilePhoto} alt={user.userName} className="w-10 h-10 rounded-full bg-gray-200"/>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold text-xs mr-1 truncate">{user ? `@${user.userName}` : "anonymous user"}</span>
          <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ?(
          <>
          <Textarea value={editedContent} onChange={(e)=>setEditedContent(e.target.value)}
           className="mb-2"
          />
          <div className="flex justify-end text-xs gap-2">
            <Button type="button" size="sm" gradientDuoTone="purpleToBlue" onClick={handleSave}>Save</Button>
            <Button type="button" size="sm" gradientDuoTone="purpleToBlue" onClick={()=>setIsEditing(false)}>Cancel</Button>
          </div>
          </>
        ):(
          <>
          <p className="text-gray-500 pb-2">{comment.content}</p>
          <div className="flex items-center pt-2 text-xs border-t max-w-fit gap-2 dark:text-gray-700">
            <button type="button" onClick={()=>onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id)&& `!text-blue-500` } `}>
              <FaThumpsUp className="text-sm"/>
            </button>
            <p className="text-gray-400">
              {
                comment.numberOfLikes >0 && comment.numberOfLikes + " " + {comment.numberOfLikes === 1 ? "like" :"likes"}
              }
            </p>
           {
            currentUser &&( currentUser._id === comment.userId || currentUser.isAdmin)&& (
              <button type="button" className="text-gray-400 hover:text-blue-500" onClick={handleEdit}>
                Edit
              </button>
            )
           }
          </div>

        </>
        )}
      </div>
    </div>
  )
}
