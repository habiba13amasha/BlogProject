import { useEffect,useState } from "react";
import {Link, useLocation } from "react-router-dom"
import {Sidebar} from "flowbite-react"
import {HiArrowSmRight, HiUser} from "react-icons/hi"
import {useDispatch} from "react-redux"
import { signOutSuccess } from "../redux/user/userSlice";

export default function DashSidebar() {
    const location = useLocation();
    const [tab,setTab]=useState("")
    const dispatch=useDispatch()

    useEffect(()=>{
      const urlParams=new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get("tab")
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
    },[location.search])
    const handleSignOut=async() => {
      try {
        const res=await fetch("/api/user/signout",{
          method: "POST",
        })
        const data=await res.json()
        if(!res.ok){
          console.log(data.message)
        }else{
          dispatch(signOutSuccess())
        }
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <Sidebar className="w-full md:w-56 bg-indigo-300 ">
        <Sidebar.Items>
            <Sidebar.ItemGroup className="px-1">
                <Link to="/dashboard?tab=profile">
                  <Sidebar.Item active={tab==="profile"} icon={HiUser} label="user" labelColor="dark" className="py-1" as="div">Profile</Sidebar.Item>
                </Link>
                <Sidebar.Item  icon={HiArrowSmRight} className="cursor-pointer " onClick={handleSignOut}>Sign Out</Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
