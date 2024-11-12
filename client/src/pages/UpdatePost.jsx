import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {getStorage,uploadBytesResumable,ref,getDownloadURL} from "firebase/storage"
import {CircularProgressbar} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css";
import {app} from "../firebase.js"
import {useNavigate,useParams} from "react-router-dom"
import { useEffect } from "react";
import {useSelector} from "react-redux"

export default function UpdatePost() {
    const {currentUser}=useSelector(state=>state.user)
  const [file,setFile]=useState(null)
  const[formData,setFormData]=useState({})
  const[imageUploadProgress,setImageUploadProgress]=useState(null)
  const [imageUploadError,setImageUploadError]=useState(null)
  const [publishError,setPublishError]=useState(null)
  const navigate=useNavigate()
  const {postId}=useParams()

  useEffect( ()=>{
    
    try{
        const fetchPost=async()=>{
            const res=await fetch(`/api/post/getposts?postId=${postId}`)
            const data=await res.json()
            if(!res.ok){
               setPublishError(data.message)
               return
            }else{
              setPublishError(null)
              setFormData(data.posts[0])
            }
        }
        fetchPost()
    }catch(err){
        console.log(err)
    }
  },[postId])
  const handleUploadImage=async()=>{
    try {
        if(!file){
            setImageUploadError("Please select an image")
            return
        } 
        setImageUploadError(null)
        const storage=getStorage(app)  
        const fileName=new Date().getTime() + '-' + file.name
        const storageRef=ref(storage,fileName)
        const uploadTask=uploadBytesResumable(storageRef,file)
        uploadTask.on("state_changed",
            (snapshot) => {
                const progress=((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setImageUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageUploadError(error.message || "could not upload image"),
                setImageUploadProgress(null)
             },
            () => {
               getDownloadURL( uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUploadError(null)
                    setImageUploadProgress(null)
                    setFormData({...formData,image:downloadURL})
                });
            })
    } catch (error) {
        setImageUploadError("image upload failed")
        setImageUploadProgress(null)
        console.log(error)
    }
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        const res=await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
            method: "PUT",
            credentials: 'include',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(formData)
        })
        const data=await res.json()
        if(!res.ok){
            setPublishError(data.message)
            return
        }else{
            setPublishError(null)
            navigate(`/post/${data.slug}`)
        }
    } catch (error) {
        setPublishError(error.message)
    }

  }
  return (
   <>
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type="text" placeholder="Title" required id="title" value={formData.title} className="flex-1"
                 onChange={(e)=>{setFormData({...formData,title:e.target.value} )}}/>
                <Select value={formData.category}  onChange={(e)=>{setFormData({...formData,category:e.target.value} )}} >
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">ReactJs</option>
                    <option value="nextjs">NextJs</option>
                    <option value="NodeJs">NodeJs</option>
                    <option value="express">Express</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted p-3">
                <FileInput type="file" accept="/image/*" onChange={(e)=>{setFile(e.target.files[0])}}/>
                <Button type="button" color="blue" size="md" onClick={handleUploadImage} disabled={imageUploadProgress}>
                    {imageUploadProgress?
                    <div className="w-16 h-16">
                      <CircularProgressbar value={imageUploadProgress || 0 } text={`${imageUploadProgress}%`} />
                    </div> : "Upload Image"
                    }
                </Button>
            </div>
            {imageUploadError&&
             <Alert color="failure">
                {imageUploadError}
             </Alert>
            }
            {formData.image&&
             <img src={formData.image} alt="upload" className="max-w-full h-64 object-cover"/>
            }
            <ReactQuill theme="snow" placeholder="Write something....." value={formData.content} className="mb-10 h-72" required 
             onChange={(value)=>{setFormData({...formData,content:value})}}/>
            <Button type="submit" color="blue">Update</Button>
            {publishError&&
             <Alert color="failure" className="mt-5">
                {publishError}
             </Alert>
            }
        </form>
    </div>
   </>
  )
}
