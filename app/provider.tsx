"use client"
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useUser } from '@clerk/nextjs';
import { UserDateilContext } from './context/userContext';
import { Toaster } from '@/components/ui/sonner';
import { onSaveContext } from './context/onSaveContext';


const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  let [saveData,setSaveData] = useState<any>(null)
  let [set,setdata]= useState<any>("")
let {user} = useUser()
  useEffect(()=>{
user&&res()
  },[user])
    let res = async()=>{
        let data = await axios.post("/api/user",{})
        console.log("data",data.data.data);
        setdata(data.data.data)
        
    }
  return (
    <div>
      <UserDateilContext.Provider value={{set,setdata}} >
        <onSaveContext.Provider value={{saveData,setSaveData}}>
      {children}
      </onSaveContext.Provider>
      <Toaster/>
      </UserDateilContext.Provider>
    
    </div>
  )
}

export default Provider
