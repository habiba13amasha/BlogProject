import { Alert, Button, Modal, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import {useSelector,useDispatch} from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {app} from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure,deleteStart,deleteSuccess,deleteFailure } from "../redux/user/userSlice"
import {HiOutlineExclamationCircle} from "react-icons/hi"
export default function DashProfile() {
    const dispatch=useDispatch()
    const {currentUser,error } = useSelector(state => state.user)
    const filePikerRef=useRef()
    const [imageFile,setImageFile]=useState(null)
    const [imageFileUrl,setImageFileUrl]=useState(null)
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
    const[imageFileUploadError,setImageFileUploadError]=useState(null)
    const [imageFileUploading,setImageFileUploading]=useState(false)
    const [formData,setFormData]=useState({})
    const[updateUserSuccess,setUpdateUserSuccess]=useState(null)
    const[updateUserError,setUpdateUserError]=useState(null)
    const[showModal,setShowModal]=useState(false)
    const handleChangeImage=(e)=>{
      const file=e.target.files[0]
      if (file){
        setImageFile(file)  // تخزين الملف في حالة `imageFile`
        setImageFileUrl(URL.createObjectURL(file)) // عرض الصورة بشكل مؤقت قبل رفعها
      }

    }
   useEffect(()=>{
     if (imageFile){
       uploadImage() // استدعاء دالة رفع الصورة فقط عند تحديد صورة جديدة
     }
   },[imageFile])

   const uploadImage=async ()=>{
    // service firebase.storage {
   // match /b/{bucket}/o {
  //  match /{allPaths=**} {
  //    allow read;
  //    allow write:if
 //   request.resource.size < 2 * 1024 * 1024 &&
 //   request.resource.contentType.matches("image/.*")
 // }
// }
//  }
  //}
   setImageFileUploading(true)
   setImageFileUploadError(null)
    const storage=getStorage(app) // ينادي على Firebase Storage
    const fileName=new Date().getTime() + imageFile.name // توليد اسم فريد للملف باستخدام timestamp
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,fileName) //  يبدأ عملية رفع الملف باستخدام uploadBytesResumable الذي يسمح بمراقبة تقدم التحميل
    uploadTask.on("state_changed",
       (snapshot) => {  //يمثل لقطة لحالة عملية الرفع الحالية. توفر هذه اللقطة معلومات مثل حجم البيانات التي تم نقلها (bytesTransferred) وإجمالي حجم الملف (totalBytes).
      const progress=((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      setImageFileUploadProgress(progress.toFixed(0))}, // هنا يتم تعيين قيمة progress (بعد تحويلها إلى عدد صحيح)
      (error) => {
        setImageFileUploadError(error.message || "could not upload image(File must be less than 2MB)"),
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
       // عند الانتهاء من الرفع
      ()=>{  
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setImageFileUrl(downloadURL) //  الحصول على رابط التنزيل للصورة ليتم عرضها من  Firebase مباشرة
          setFormData({...formData,profilePhoto:downloadURL})
          setImageFileUploading(false)
        })
      }
    )
  }
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id] : e.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if(Object.keys(formData).length ===0){
      setImageFileUploadError("No changes made")
      return
    }
    if(imageFileUploading){
      setImageFileUploadError("Please wait image to upload")
      return 
    }
    try {
      dispatch(updateStart)
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
      })
      const data=await res.json()
      if(!res.ok){
        dispatch(updateFailure(data.message))
        setImageFileUploadError(data.message)
      }else{
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User`s profile updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setImageFileUploadError(error.message)
    } 
  }
  
  const handleDeleteUser= async()=>{
    setShowModal(false)
    try {
      dispatch(deleteStart())
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      })
      const data=await res.json()
      if(!res.ok){
        dispatch(deleteFailure(data.message))
        
      }else{
        dispatch(deleteSuccess(data))
      }
    } catch (error) {
      dispatch(deleteFailure(error.message))
    }
  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full ">
        <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-5 " onSubmit={handleSubmit}>
          <input type="file"  accept="image/*"  onChange={handleChangeImage} ref={filePikerRef} hidden/>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePikerRef.current.click()}>
              {imageFileUploadProgress &&
                <CircularProgressbar value={imageFileUploadProgress || 0 } text={`${imageFileUploadProgress}%`} 
                 strokeWidth={5} 
                 styles={{
                  root:{
                    width:"100%", height:"100%",position:"absolute",top:0,left:0} ,
                    path:{
                      stroke: `rgba(62,152,199,${imageFileUploadProgress /100})`,
                    }
                 }}/>
              }
              <img src={imageFileUrl || currentUser.profilePhoto} alt="user" 
                className={`rounded-full w-full h-full object-cover border-8 border[lightgray] ${imageFileUploadProgress && imageFileUploadProgress<100 && "opacity-60"}`}/>
            </div>
            {imageFileUploadError &&
             <Alert color="failure">
              {imageFileUploadError}
             </Alert>
            }
            <TextInput type="text" id="userName" placeholder="userName" defaultValue={currentUser.userName} onChange={handleChange}/>
            <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />
            <Button type="submit" className="bg-indigo-700 text-blue-50">Update</Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer" onClick={()=>setShowModal(true)}>Delete Account </span>
            <span className="cursor-pointer">Sign Out </span>
        </div>
        {updateUserSuccess&&(
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
        )}
        {updateUserError&&(
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
        )}
         {error&&(
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
        )}
        <Modal show={showModal} popup size="md" onClose={()=>setShowModal(false)}>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-5 mx-auto dark:text-gray-200  "/>
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">Are you sure you want to delete your account?</h3>
            </div>
            <div className="flex  justify-center gap-10 mb-5">
              <Button color="red" onClick={handleDeleteUser}>Yes,I`m sure</Button>
              <Button color="gray" onClick={()=>setShowModal(false)}>No,Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  )
}

