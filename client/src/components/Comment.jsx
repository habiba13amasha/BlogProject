import { useEffect, useState } from "react"
import moment from "moment"
export default function Comment({comment}) {
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
      </div>
    </div>
  )
}
