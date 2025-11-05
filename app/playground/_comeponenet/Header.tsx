import { onSaveContext } from '@/app/context/onSaveContext'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useContext } from 'react'

const Header = () => {
  let {savedata,setSaveData}= useContext(onSaveContext)
  return (
    <div className='flex w-full py-4 justify-between items-center px-5 border-b'>
      <Image src={"/logo.svg"} height={30} width={30} alt='logo'/>
      <Button onClick={()=>setSaveData(Date.now())}>Save</Button>
    </div>
  )
}

export default Header
