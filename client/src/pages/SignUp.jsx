import { Link,useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [errorMessage,setErrorMessage]=useState(null)
  const [loading,setLoading]=useState(false)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.userName|| !formData.email|| !formData.password){
      return setErrorMessage("Please fill out All fields")
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success===false){
       return(
         setErrorMessage(data.message) ,
         setLoading(false)
       )
      }else{
        setLoading(false),
        navigate('/sign-in')
      }
       
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
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
          This is a demo project. you can sign up with your email and password or with Google.
        </p>
        </div>

        {/*right side */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username"/>
              <TextInput type="text" placeholder="username" id="userName" onChange={handleChange} required />
            </div>
            <div>
              <Label value="Your Email"/>
              <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange} required />
            </div>
            <div>
              <Label value="Your Password"/>
              <TextInput type="password" placeholder="password" id="password" onChange={handleChange} required />
            </div>
            <Button type="submit" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" disabled={loading}>
              {loading ? (
                <>
                 <Spinner size="sm"/>
                 <span className="pl-3">Loading....</span>
                </>
              ) : "Sign Up"
              }
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500" >Sign In</Link>
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
