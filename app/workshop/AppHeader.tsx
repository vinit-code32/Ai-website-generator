import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';

const AppHeader = () => {
  return (
    <div className='flex justify-between shadow-2xl flex-1  p-4 items-center'>
      <SidebarTrigger/>
      <UserButton/>
    </div>
  )
}

export default AppHeader
