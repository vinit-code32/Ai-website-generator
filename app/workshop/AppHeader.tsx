import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const AppHeader = () => {
  return (
    <div className='flex justify-between shadow-2xl flex-1  p-4 items-center'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger><SidebarTrigger/></TooltipTrigger>
          <TooltipContent>
            <p>SideBar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UserButton/>
    </div>
  )
}

export default AppHeader
