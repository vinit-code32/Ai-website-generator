"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { ArrowUp, HomeIcon, ImageIcon, ImagePlusIcon, Key, LayoutDashboardIcon, LoaderCircleIcon, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {toast} from "sonner"
import { ContainerTextFlipDemo } from './Word'
let data =[
  {
    name: "Dashboard UI",
    
 icon:<LayoutDashboardIcon/>,
    prompt: "Create a modern and responsive admin dashboard using Next.js, Tailwind CSS, and TypeScript. Include a sidebar with navigation links (Dashboard, Users, Analytics, Settings), a top navbar with a search bar and profile dropdown, and main content cards showing stats, charts, and recent activities. Use Framer Motion for smooth transitions and animations between pages."
  },
  {
    name: "Signup Form",
    icon:<Key/>,
    prompt: "Design a sleek and accessible signup form using React, Tailwind CSS, and Framer Motion. Include fields for Full Name, Email, Password, and Confirm Password, with inline validation messages and a 'Create Account' button. Add subtle animations on focus and a link to redirect to the login page. Make it mobile-friendly and centered in the viewport with a clean UI."
  },
  {
    name: "Hero Section",
     icon:<HomeIcon/>,
    prompt: "Build a visually appealing hero section for a landing page using Next.js and Tailwind CSS. Include a large headline, subtext paragraph, and two call-to-action buttons (e.g., 'Get Started' and 'Learn More'). Add a background gradient or minimal illustration and apply Framer Motion for text fade-in and button hover animations. Ensure the section is responsive and centered."
  },
  {
    name: "User Profile Card",
 icon:<User/>,
    prompt: "Create a modern user profile card component using React and Tailwind CSS. The card should display the user's avatar, name, role, bio, and action buttons (Follow / Message). Include hover effects, rounded corners, and shadow. Optionally, animate it with Framer Motion for smooth hover scale effects. Keep the design clean and responsive."
  }
]



const Hero = () => {
  const [InputValue,setInput] = useState<string>()
  const [isLoading,setLoading] = useState<boolean>(false)
  console.log(InputValue);
  let user = useUser()
  let router = useRouter()
console.log(user);

  let createProject = async()=>{
    try{
      setLoading(true)
    let projectId =  uuidv4()
    let frameID = farmid()
    let message = {
      role:"user",
      content:InputValue
    }
    let res = await axios.post("/api/play",{
      projectId,
      farmeId:frameID,
      message
    })
    console.log(res.data)
  setLoading(false)
  toast.success("project Created")
   router.push(`/playground/${projectId}?farme=${frameID}`)
   

}
    catch(e){
      console.log(e);
      
    }
    
  }
 
  return (
    <div className='flex flex-col justify-center items-center h-[80vh] '> 
    <div className='flex flex-col items-center w-full justify-center gap-2 '>
      <h1 className='md:text-6xl sm:text-5xl text-4xl font-bold text-center '>What Should We Design</h1>
      <ContainerTextFlipDemo/>
      </div>
      <h1 className='text-2xl mt-2 text-gray-400 text-center p-5'>Generate, Edit and Explore desig with AI, Export code as well</h1>
      <div className="w-full max-w-2xl mt-3  border p-6 rounded-2xl">
     
        <textarea id="ai" defaultValue={InputValue} onChange={(e)=>setInput(e.target.value)} placeholder='Describe your page design ' className='w-full max-w-2xl h-24  focus:outline-none focus:resize-none resize-none' name=""/>
      <div className='flex justify-between items-center w-full'>
        <Button variant={"ghost"} className=''><ImagePlusIcon/></Button>
        {!user?.user?( <SignInButton mode='modal'  forceRedirectUrl={"/workshop"}>
          <Button id='ai' disabled={!InputValue} ><ArrowUp/></Button>
        </SignInButton>): (<Button id='ai' onClick={createProject} disabled={!InputValue||isLoading} >{isLoading?<LoaderCircleIcon className='animate-spin'/>:<ArrowUp/>}</Button>)}
        
      </div>
      
      </div>
      <div className=" items-center gap-4 grid max-sm:grid-cols-2 md:grid-cols-4 max-w-2xl mt-4 justify-center">
{data.map((item,i)=>(
  <Button onClick={()=>setInput(item.prompt)} key={i} variant={"outline"} className="flex gap-2 items-center">
    {item.icon}
    <h1>{item.name}</h1>
  </Button>
))}
      </div>

    </div>
  )
}

export default Hero
const farmid = ()=>{
   const make = Math.floor(Math.random()*10000)
   console.log(make)
   return make
}