"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { UserDateilContext } from "@/app/context/userContext"

import { useAuth, UserButton, useUser } from "@clerk/nextjs"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

export  function AppSidebar () {
  const [project,setproject] = useState([])
  let {set,setdata} = useContext(UserDateilContext)
  let [isLoading,setLoading] = useState<boolean>(false)
  let {has} =  useAuth()
  console.log("set",set,setdata);
  useEffect(()=>{
    futchProject()
  },[])
  let futchProject =async()=>{
    setLoading(true)
    let res = await axios.get("/api/all_project")
   
      setproject(res.data)
      setLoading(false)
    
  }
  const { user } = useUser();

  // Assume you store plan name in user.publicMetadata.plan
 const plan = user?.publicMetadata?.subscription;
const hasPremiumAccess = plan === 'unlimited';



  console.log(hasPremiumAccess);
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex w-full p-4 items-center gap-3 ">
          <Link href="/">
            <Image className="" width={60} height={60} src="/logo.svg" alt="logo"/></Link>
            <h1 className="text-2xl font-bold ">AI Website Builder</h1>
        </div>
    <Link   href="/workshop" className="mt-2 w-full px-4">
  
        <Button  className="w-full"><label htmlFor="ai">+ Add Project</label></Button>
    </Link>
    
      
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel >project</SidebarGroupLabel>
          {(!isLoading&&project.length)?project.length==0?<h1 className="w-full text-xl text-gray-400 mt-1">No project found</h1>:(project.map((item:any,i)=>(
           <Link className="cursor-pointer hover:bg-secondary p-3 rounded-lg" href={`/playground/${item.projectId}?farme=${item.farmeId}`} key={i} ><h1 className="line-clamp-1">{item.chats[0].chatMessages[0].content}</h1></Link>
          ))):<div className="flex gap-2 p-3 bg-secondary items-center"><Loader2 className="animate-spin"/> Loading...</div>}
        
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="">
        {!hasPremiumAccess&&
        <div className="w-full p-3 rounded-2xl bg-secondary border space-y-2">
          <h1 className=" text-black gap-1 flex items-center ">Remaining Credits <span className="text-xl font-bold ">{set.creadit}</span></h1>
         <Progress value={33}/>
          <Link href={"/workshop/price"}><Button className="w-full mt-2">Upgrade to Unlimited</Button></Link>
        </div>}
      </SidebarFooter>
      <div className="flex  gap-4 items-center mb-2 px-4">
        <UserButton/>
<h1 className="text-md  " >Settings</h1>
      </div>
    </Sidebar>
  )
}