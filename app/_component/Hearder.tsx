"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

let data = [{
name:"pricing",
path:"/workshop/price"
},
{
name:"Contect Us",
path:"/countect us"
}];



const Hearder = () => {
    let user = useUser()
  return (
    <div className='px-4 mx-auto py-4 flex justify-between items-center shadow-2xl'>
      <div className="flex item-center gap-3 justify-center">
      <Image src={"/logo.svg"} alt='logo' height={30} width={30} className=' ' />
      <h1 className="text-xl font-bold">AI Website </h1>
      </div>
      <div className="flex jus gap-2 item-center">{
        data.map((index,i)=>(
         <Link key={i} href={index.path}> <Button variant={"ghost"}>{index.name}</Button></Link>
        ))}
        </div>
        {
            user.user?.fullName?(<Link href="/workshop" ><Button>Get Started <ArrowRight/></Button></Link>):(<SignInButton mode='modal'><Button>Get Started <ArrowRight/></Button></SignInButton>)
        }
</div>
  )
}

export default Hearder
