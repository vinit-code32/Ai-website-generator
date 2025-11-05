
"use client";
import React, { useRef, useState } from "react";
import {
    Image as ImageIcon,
    Crop,
    Expand,
    Image as ImageUpscale, // no lucide-react upscale, using Image icon
    ImageMinus,
    Loader2,
    X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageKit from "imagekit";

type Props = {
    selectedEl: HTMLImageElement,
    clearSelection:()=>void
};

const transformOptions = [
    { label: "Smart Crop", value: "smartcrop", icon: <Crop /> ,transformations:"fo-auto"},
    { label: "Resize", value: "resize", icon: <Expand />,transformations:"e-dropshadow"},
    { label: "Upscale", value: "upscale", icon: <ImageUpscale /> ,transformations:"e-upscale"},
    { label: "BG Remove", value: "bgremove", icon: <ImageMinus />,transformations:"e-bgremove" },
];

function ImageSettingSection({ selectedEl,clearSelection }: Props) {
    const [altText, setAltText] = useState(selectedEl.alt || "");
    const [width, setWidth] = useState<number>(selectedEl.width || 300);
    const [height, setHeight] = useState<number>(selectedEl.height || 200);
    const [selectFile,setfile] = useState<File>()
    const [isLoading,setLoading]= useState<boolean>(false)
    const [borderRadius, setBorderRadius] = useState(
        selectedEl.style.borderRadius || "0px"
    );
    const [preview, setPreview] = useState(selectedEl.src || "");
    const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    var imagekit = new ImageKit({

    publicKey :"public_PxktGof66b0YrbRq+3f7ysxDR2I=" ,
    privateKey : "private_OMW1NBAVLdN2PhaAuZO74MawlT0=",
    urlEndpoint :"https://ik.imagekit.io/zekmsstvp"
});
    // Toggle transform
    const toggleTransform = (value: string) => {
        setActiveTransforms((prev) =>
            prev.includes(value)
                ? prev.filter((t) => t !== value)
                : [...prev, value]
        );
    };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setfile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    let UploadFile = async()=>{
        setLoading(true)
        if(selectFile){
        let Upload = await imagekit.upload({
            //@ts-ignore
            file:selectFile,
            fileName:`${Date.now()}.png`,
            isPublished:true
             
        })
        setLoading(false)
        //@ts-ignore
        selectedEl.setAttribute("src",Upload.url+"?tr=")
        
     console.log(Upload)}
      
        
    }

    

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };
let generaterAiImage=()=>{
    setLoading(true)
    let url =`https://ik.imagekit.io/zekmsstvp/ik-genimg-prompt-${altText}/${Date.now()}.png?tr=`
    setPreview(url)
    selectedEl.setAttribute("src",url)
}

let ApplyTransFormation = (tranval:string)=>{
    setLoading(true)
    if(!preview.includes(tranval)){
    let url = preview+tranval+","
    setPreview(url)
      selectedEl.setAttribute("src",url)}
      else{
        let url = preview.replaceAll(tranval+",","")
        setPreview(url)
      selectedEl.setAttribute("src",url)
      }
    

}
    return (
        <div className="w-96 shadow p-4 space-y-4">
            <div className="flex justify-between items-center">
            <h2 className="flex gap-2 items-center font-bold">
                <ImageIcon /> Image Settings
            </h2>
            <Button onClick={()=>clearSelection()}><X/></Button>
            </div>

            {/* Preview (clickable) */}
            <div className="flex justify-center">
                <img
                    src={preview}
                    alt={altText}
                    className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
                    onClick={openFileDialog}
                    onLoad={()=>setLoading(false)}
                />
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Upload Button */}
            <Button
                type="button"
                className="w-full"
                onClick={UploadFile}
                disabled={isLoading}
            >
             {isLoading&&<Loader2 className="animate-spin" />} Upload Image
            </Button>

            {/* Alt text */}
            <div>
                <label className="text-sm">Prompt</label>
                <Input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Enter alt text"
                    className="mt-1"
                />
            </div>

            <Button className="w-full" onClick={generaterAiImage} disabled={isLoading}>
               {isLoading&&<Loader2 className="animate-spin" />}  Generate AI Image
            </Button>

            {/* Transform Buttons */}
            <div>
                <label className="text-sm mb-1 block">AI Transform</label>
                <div className="flex gap-2 flex-wrap">
                    <TooltipProvider>
                        {transformOptions.map((opt) => {
                            const applied = activeTransforms.includes(opt.value);
                            return (
                                <Tooltip key={opt.value}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant={preview.includes(opt.transformations)?"default":"outline"}
                                            className="flex items-center justify-center p-2"
                                            onClick={() => ApplyTransFormation(opt.transformations)}
                                        >
                                            {opt.icon}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {opt.label} {applied && "(Applied)"}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </TooltipProvider>
                </div>
            </div>

            {/* Conditional Resize Inputs */}
            {activeTransforms.includes("resize") && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-sm">Width</label>
                        <Input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="mt-1"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm">Height</label>
                        <Input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="mt-1"
                        />
                    </div>
                </div>
            )}

            {/* Border Radius */}
            <div>
                <label className="text-sm">Border Radius</label>
                <Input
                    type="text"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    placeholder="e.g. 8px or 50%"
                    className="mt-1"
                />
            </div>
        </div>
    );
}


export default ImageSettingSection;
