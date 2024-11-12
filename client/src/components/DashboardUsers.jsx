import { useEffect, useState } from "react"
import {useSelector} from "react-redux"
import {Table,Modal,Button} from "flowbite-react"
import {HiOutlineExclamationCircle} from "react-icons/hi"
import {FaCheck,FaTimes} from "react-icons/fa"
export default function DashboardUsers() {
  const {currentUser}=useSelector(state=>state.user)
  const [users,setUsers]=useState({})
  const[showMore,setShowMore] = useState(true)
  const [showModal,setShowModal]=useState(false)
  const[userIdToDelete,setUserIdToDelete] = useState("")
  const handleDeleteUser=async()=>{
    setShowModal(false)
    try {
      const res=await fetch(`/api/user/deleteuser/${userIdToDelete}`,{
        method: 'DELETE',
      })
      const data=await res.json()
      if(!res.ok){
        console.log(data.message)
      } else{
        setUsers(users.filter(user=>user._id!==userIdToDelete))
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleShowMore=async()=>{
    const startIndex=users.length;
    try {
      const res=await fetch(`/api/user/getusers?startIndex=${startIndex}`)
      const data=await res.json()
      if(res.ok){
        setUsers([...users,...data.users]) //يتم تحديث حالة المنشورات (userPosts) بدمج المنشورات الجديدة التي تم جلبها (data.posts) مع المنشورات الحالية.,,,يتم استخدام ... (spread operator) لدمج المنشورات.
        if(data.users.length<9){
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
     const fetchUsers=async ()=>{
      try{
        const response=await fetch("/api/user/getusers")
        const data=await response.json()
        if(response.ok){
          setUsers(data.users)
          if(data.users.length<9){
             setShowMore(false)
          }
        }
        
      }catch(err){
        console.log(err)
      }
     }
     if(currentUser.isAdmin){
       fetchUsers()
     }
  },[currentUser._id])

  return (
    <>
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin &&users.length >0 ?
       <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Created</Table.HeadCell>
            <Table.HeadCell>User image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {users.map((user)=>(
            <Table.Body key={user._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(user.createdAt).toLocaleDateString() }</Table.Cell>
                <Table.Cell>
                  <img src={user.profilePhoto} alt={user.username} className=" rounded-full w-10 h-10 object-cover bg-gray-500"/> 
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>)}</Table.Cell>
                <Table.Cell>
                  <span onClick={()=>{setShowModal(true),setUserIdToDelete(user._id)}} className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
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
      <p>You have no users yet!</p>
      }
      <Modal show={showModal} popup size="md" onClose={()=>setShowModal(false)}>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-5 mx-auto dark:text-gray-200  "/>
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">Are you sure you want to delete this user?</h3>
            </div>
            <div className="flex  justify-center gap-10 mb-5">
              <Button color="red" onClick={handleDeleteUser}>Yes,I`m sure</Button>
              <Button color="gray" onClick={()=>setShowModal(false)}>No,Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>
    </div>
    
    </>
  )
}
