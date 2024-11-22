import { useEffect, useState } from "react"
import moment from "moment"
import {FaThumpsUp} from "react-icons/fa"
import { useSelector } from "react-redux"
export default function Comment({comment,onLike}) {
  const {currentUser}=useSelector(state=>state.user)
    const [user,setUser]=useState({})
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
        </div>
      </div>
    </div>
  )
}
