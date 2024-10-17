import { Link,useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import {useDispatch,useSelector} from "react-redux"
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import { OAuth } from "../components//OAuth";
export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const {loading,error:errorMessage}=useSelector(state=>state.user)
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email|| !formData.password){
      dispatch(signInFailure("Please fill out All fields"))
    }
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(signInFailure(data.message))
      }else{
        dispatch(signInSuccess(data))
        navigate('/')
      }
       
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-5 max-w-3xl mx-auto flex-col md:flex-row md:items-center ">

        {/*left side */}

        <div className="flex-1">
         {/*logo */}
         <Link to="/" className="text-4xl font-bold text-gray-800 dark:text-white ">
          <span className="px-1.5 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-blue-50">
            Habiba
          </span>
          Blog
        </Link>
        <p className="text-sm mt-5">
          This is a demo project. you can sign in with your email and password or with Google.
        </p>
        </div>

        {/*right side */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email"/>
              <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange} required />
            </div>
            <div>
              <Label value="Your Password"/>
              <TextInput type="password" placeholder="**********" id="password" onChange={handleChange} required />
            </div>
            <Button type="submit" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" disabled={loading}>
              {loading ? (
                <>
                 <Spinner size="sm"/>
                 <span className="pl-3">Loading....</span>
                </>
              ) : "Sign In"
              }
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don`t have an account?</span>
            <Link to="/sign-up" className="text-blue-500" >Sign Up</Link>
          </div>
          {
              errorMessage && (
                <Alert className="mt-8 font-bold bg-red-500">
                 <strong>Error: </strong> 
                 {errorMessage}
                </Alert>
               
              )       
            }
        </div>
      </div>
    </div>
  )
}
