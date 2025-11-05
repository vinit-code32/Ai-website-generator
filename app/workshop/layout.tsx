import { AppSidebar } from '@/app/context/AppsideBar';
import { SidebarProvider,SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react'
import AppHeader from './AppHeader';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
        <SidebarProvider>
          <AppSidebar/>
          <main className="w-full" >
            <AppHeader/>
      {children}
      </main>


      </SidebarProvider>
    </div>
  )
}

export default layout
