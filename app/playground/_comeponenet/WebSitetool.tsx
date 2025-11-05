"use client"
import { Button } from '@/components/ui/button'
import { Code, Download, ExternalLinkIcon, Monitor, TabletSmartphone } from 'lucide-react'
import  { useEffect, useState } from 'react'

import CodeView from './CodeView';
import {  useSearchParams } from 'next/navigation';
type props = {
  screenSize:string,
  setScreenSize:any,
  generateCode:string
}
let HTML_CODE =`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
          <title>AI Website Builder</title>

          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>

          <!-- Flowbite CSS & JS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

          <!-- Font Awesome / Lucide -->
          <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

          <!-- Chart.js -->
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

          <!-- AOS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

          <!-- GSAP -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

          <!-- Lottie -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

          <!-- Swiper -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

          <!-- Tippy.js -->
          <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
          <script src="https://unpkg.com/@popperjs/core@2"></script>
          <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="root">{code}</body>
      </html>
    `
const WebSitetool = ({screenSize,setScreenSize,generateCode}:props) => {
  let [finalCode,setCode] = useState<string>()
let res = useSearchParams()
let farmeId = res.get("farme")
console.log(farmeId);


  useEffect(()=>{
 let cleanCode = (HTML_CODE.replace("{code}",generateCode)||"").replaceAll("```html","").replace("```","").replace("html","")
 setCode(cleanCode) 
  },[generateCode])
  let ViewWebsite = ()=>{
    if(!generateCode) return;

   
    const blow = new Blob([finalCode||""],{type:"text/html"})
    const url = URL.createObjectURL(blow)

    window.open(url,"_blank")

  }
    const handleDownload = () => {
    // 1️⃣ Create a Blob from the code string
    const blob = new Blob([finalCode||""], { type: "text/html" });

    // 2️⃣ Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // 3️⃣ The name of the file user will get
    a.download = `website-${farmeId}.html`;

    // 4️⃣ Trigger the click in the browser
    document.body.appendChild(a);
    a.click();

    // 5️⃣ Clean up the URL and element
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className='p-2 w-full border rounded-b-xl flex justify-between items-center'>
      <div className='flex gap-2 items-center'>
        <Button variant={"ghost"} className={`${screenSize=="Monitor"&&"border-2 border-black"}`} onClick={()=>setScreenSize("Monitor")}><Monitor/></Button>
        <Button variant={"ghost"} className={`${screenSize=="smartPhone"&&"border-2 border-black"}`}  onClick={()=>setScreenSize("smartPhone")}><TabletSmartphone/></Button>
      </div>
      <div className="flex gap-2 items-center justify-center">
<Button onClick={ViewWebsite} variant={"ghost"}>View <ExternalLinkIcon/></Button>
<CodeView code={finalCode}><Button>Code <Code/></Button></CodeView>

<Button onClick={handleDownload}>Download <Download/></Button>
      </div>
    </div>
  )
}

export default WebSitetool
