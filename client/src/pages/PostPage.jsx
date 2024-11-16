import { Button, Spinner } from "flowbite-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import CallToAction from "../components/CallToAction"
export default function PostPage() {
  const {postSlug}=useParams()
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(false)
  const [post,setPost]=useState(null)
  useEffect(()=>{
    const fetchPost=async()=>{
      try {
        setLoading(true)
        const res=await fetch(`/api/post/getposts?slug=${postSlug}`)
        const data=await res.json()
        if(!res.ok){
          setLoading(false)
          setError(true)
          return
        }else{
          setPost(data.posts[0])
          setLoading(true)
          setError(false)
        }

      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchPost()
  },[postSlug])
  if (loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl"/>
      </div>
    )
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
     <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl"> {post&& post.title}</h1>
     <Link to={`/search?category=${post&&post.category}`}>
       <Button color="gray" pill size="xs" className="self-center mt-5">{post&&post.category}</Button>
     </Link>
     <img src={post&&post.image} alt={post&&post.image} className="mt-10 p-3 max-h-[600px] w-full object-cover"/>
     <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
      <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
      <span className="italic">{post&&(post.content.length/1000).toFixed(0)}mins read</span>
     </div>
     <div dangerouslySetInnerHTML={{__html:post&&post.content}} className="post-content p-3 max-w-2xl w-full mx-auto"></div>
     <div className="max-w-4xl mx-auto w-full">
      <CallToAction/>
     </div>
    </main>
  )
}
