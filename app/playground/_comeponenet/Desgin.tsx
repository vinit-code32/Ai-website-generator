import React, { useContext, useEffect, useRef, useState } from 'react'
import WebSitetool from './WebSitetool';
import Settings from './settings';
import ImageSettingSection from './Image';
import { onSaveContext } from '@/app/context/onSaveContext';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'next/navigation';
type props={
  generateCode:string
}
let HTML_CODE=`
      <!DOCTYPE html>
      <html >
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
      <body id="root"></body>
      </html>
    `
const Desgin = ({generateCode}:props) => {
      let {saveData,setSaveData}= useContext(onSaveContext)
  const iframeRef = useRef<HTMLIFrameElement>(null);
console.log("iframe",iframeRef.current);

    // Initialize iframe shell once
    let [selectElement,setElement] = useState<HTMLElement| null>()
      const { projectid } = useParams();
      const searchParams = useSearchParams();
      const res = searchParams.get("farme");
useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(HTML_CODE);
    doc.close();

  
}, []);



    // Update body only when code changes
    useEffect(() => {
        if (!iframeRef.current) return;
        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        const root = doc.getElementById("root");
        if (root) {
            root.innerHTML =
                generateCode
                    ?.replaceAll("```html", "")
                    .replaceAll("```", "")
                    .replace("html", "") ?? "";
        }
        let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;



    const handleMouseOver = (e: MouseEvent) => {
        if (selectedEl) return;
        const target = e.target as HTMLElement;
        if (hoverEl && hoverEl !== target) {
            hoverEl.style.outline = "";
        }
        hoverEl = target;
        hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = (e: MouseEvent) => {
        if (selectedEl) return;
        if (hoverEl) {
            hoverEl.style.outline = "";
            hoverEl = null;
        }
    };

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;

        if (selectedEl && selectedEl !== target) {
            selectedEl.style.outline = "";
            selectedEl.removeAttribute("contenteditable");
        }

        selectedEl = target;
        selectedEl.style.outline = "2px solid red";
        selectedEl.setAttribute("contenteditable", "true");
        selectedEl.focus();
        console.log("Selected element:", selectedEl);
setElement(selectedEl)
    };

    const handleBlur = () => {
        if (selectedEl) {
            console.log("Final edited element:", selectedEl.outerHTML);
        }
    };


    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && selectedEl) {
            selectedEl.style.outline = "";
            selectedEl.removeAttribute("contenteditable");
            selectedEl.removeEventListener("blur", handleBlur);
            selectedEl = null;
        }
    };

    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc?.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
        doc.body?.removeEventListener("mouseover", handleMouseOver);
        doc.body?.removeEventListener("mouseout", handleMouseOut);
        doc.body?.removeEventListener("click", handleClick);
        doc?.removeEventListener("keydown", handleKeyDown);
    };
    }, [generateCode]);
let [ScreenSize,setScreenSize] = useState<string>("Monitor")
useEffect(()=>{
saveData&&saveUpdateData()

},[saveData])
let saveUpdateData =async()=>{
    if(iframeRef.current){
        try{
const ifarmeDoc = iframeRef.current.contentDocument||iframeRef.current.contentWindow?.document;
if(ifarmeDoc){
    const root = ifarmeDoc.getElementById("root");
if (root) {
  const clone = root.cloneNode(true) as HTMLElement;
  // only body inside #root
    let allEle = clone.querySelectorAll<HTMLElement>("*");
    allEle.forEach((i)=>{
        i.style.outline=""
        i.style.cursor=""
    })
    const html = clone.innerHTML; 
    
    console.log(html);
      const result = await axios.put("/api/farme", {
      designCode:  html ,
      farmeId: res,
      projectId: projectid,
    });
    console.log("💾 Code saved:", result.data);
    toast.success("saved!");}
  };

        } catch(e){
            console.log(e);
            
        }
    }


}
    return (
        <div className='w-full gap-1 flex '>
      <div className="w-full p-2 flex flex-col items-center">
        <iframe
            ref={iframeRef}
            className={`${ScreenSize=="smartPhone"?"w-[522px] h-[600px] rounded-xl border-2":"w-full h-[600px] border-2 rounded-t-xl"} `}
            sandbox="allow-scripts allow-same-origin"
        />
        <WebSitetool screenSize={ScreenSize} setScreenSize={setScreenSize} generateCode={generateCode}/>
</div>

{/*@ts-ignore*/}
{ selectElement?.tagName=="IMG"?<ImageSettingSection  selectedEl={selectElement} clearSelection={()=>setElement(null)}/>:selectElement?<Settings  selectedEl={selectElement} clearSelection={()=>setElement(null)} />:null}
 </div>
    );
}

export default Desgin
