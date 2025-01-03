import { useEffect,useState } from "react";
import {useLocation } from "react-router-dom"
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashboardPost from "../components/DashboardPost";
import DashboardUsers from "../components/DashboardUsers";
import DashboardComments from "../components/DashboardComments";
import DashboardComp from "../components/DashboardComp";
export default function Dashboard() {
  const location = useLocation();
  const [tab,setTab]=useState("")

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*SideBar */}
        <DashSidebar/>
      </div>
      <div className="">
        {/*Profile... */}
        {tab==="profile" && <DashProfile/>}
      </div>
      <div>
        {/*Posts... */}
          {tab==="posts" && <DashboardPost/>}
      </div>
      <div>
        {/*Users... */}
          {tab==="users" && <DashboardUsers/>}
      </div>
      <div>
        {/*Comments... */}
         {tab==="comments" && <DashboardComments/>}
      </div>
      <div>
        {/*dashboard... */}
         {tab==="dash" && <DashboardComp/>}
      </div>
    </div>
  )
}
