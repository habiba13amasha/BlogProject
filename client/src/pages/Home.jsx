import{Link} from "react-router-dom"
import CallToAction from "../components/CallToAction"
import { useEffect, useState } from "react"
import PostCard from "../components/PostCard"
export default function Home() {
  const [posts,setPosts]=useState([])

  useEffect(()=>{
    const fetchPosts=async()=>{
      try {
        const res=await fetch("/api/post/getposts")
        if(!res.ok){
          throw new Error("Failed to fetch posts")
        }
        const data=await res.json()
        setPosts(data.posts)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
  },[])
  return (
    <div>
      <div className="flex flex-col px-3 p-28 gap-6 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-xs text-gray-500 sm:text-sm">Here you will find a variety of articles and tutorials on topics such as web development,software engineering and programming language.</p>
        <Link to="/search" className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">View all posts</Link> 
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction/>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
         {
          posts&&posts.length>0 &&(
            <div className="flex flex-col gap-6">
             <h1 className="text-center font-semibold text-2xl">Recent Posts</h1>
             <div className="flex flex-wrap gap-4">
               {posts.map((post)=>(
                 <PostCard key={post._id} post={post}/>
               ))}
             </div>
             <Link to={"/search"} className="text-lg text-teal-500 text-center hover:underline">View all posts</Link>
            </div>
          )
         }
      </div>
    </div>
  )
}
