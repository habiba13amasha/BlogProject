import { useEffect, useState } from "react"
import {useSelector} from "react-redux"
import {Table,Modal,Button} from "flowbite-react"
import {HiOutlineExclamationCircle} from "react-icons/hi"
export default function DashboardComments() {
  const {currentUser}=useSelector(state=>state.user)
  const [comments,setComments]=useState({})
  const[showMore,setShowMore] = useState(true)
  const [showModal,setShowModal]=useState(false)
  const[commentIdToDelete,setCommentIdToDelete] = useState("")
  const handleDeleteComment=async()=>{
    setShowModal(false)
    try {
      const res=await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
        method: 'DELETE',
      })
      const data=await res.json()
      if(!res.ok){
        console.log(data.message)
      } else{
        setComments(comments.filter(comment=>comment._id!==commentIdToDelete))
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleShowMore=async()=>{
    const startIndex=comments.length;
    try {
      const res=await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
      const data=await res.json()
      if(res.ok){
        setComments([...comments,...data.comments]) 
        if(data.comments.length<9){
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
     const fetchComments=async ()=>{
      try{
        const response=await fetch("/api/comment/getcomments")
        const data=await response.json()
        if(response.ok){
          setComments(data.comments)
          if(data.comments.length<9){
             setShowMore(false)
          }
        }
        
      }catch(err){
        console.log(err)
      }
     }
     if(currentUser.isAdmin){
       fetchComments()
     }
  },[currentUser._id])

  return (
    <>
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin &&comments.length >0 ?
       <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Comment Content</Table.HeadCell>
            <Table.HeadCell>NumberOfLikes</Table.HeadCell>
            <Table.HeadCell>PostId</Table.HeadCell>
            <Table.HeadCell>UserId</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {comments.map((comment)=>(
            <Table.Body key={comment._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString() }</Table.Cell>
                <Table.Cell>{comment.content}</Table.Cell>
                <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                <Table.Cell>{comment.postId}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell>
                  <span onClick={()=>{setShowModal(true),setCommentIdToDelete(comment._id)}} className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                </Table.Cell>
               
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {showMore&&
         <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show more</button>
        }
       </>
      :
      <p>You have no comments yet!</p>
      }
      <Modal show={showModal} popup size="md" onClose={()=>setShowModal(false)}>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-5 mx-auto dark:text-gray-200  "/>
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">Are you sure you want to delete this comment?</h3>
            </div>
            <div className="flex  justify-center gap-10 mb-5">
              <Button color="red" onClick={handleDeleteComment}>Yes,I`m sure</Button>
              <Button color="gray" onClick={()=>setShowModal(false)}>No,Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>
    </div>
    
    </>
  )
}
