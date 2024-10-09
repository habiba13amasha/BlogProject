import { Link } from "react-router-dom";
import {Label,TextInput,Button} from "flowbite-react"
export default function SignUp() {
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
          <form className="flex flex-col gap-4">
            <div >
              <Label value="Your Username"/>
              <TextInput type="text" placeholder="username" id="username" />
            </div>
            <div >
              <Label value="Your Email"/>
              <TextInput type="email" placeholder="name@company.com" id="email" />
            </div>
            <div >
              <Label value="Your Password"/>
              <TextInput type="password" placeholder="password" id="password" />
            </div>
            <Button type="submit" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Sign Up</Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
