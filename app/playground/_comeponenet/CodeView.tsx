import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
const CodeView = ({children,code}:any) => {
  const copySubmit=async()=>{
await navigator.clipboard.writeText(code)

toast.success("copy successfully")
  }
  
  return (
    <div>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className='min-w-[1220px] max-sm:min-w-[200px] max-h-[600px] overflow-y-scroll' >
          <DialogHeader>
            <DialogTitle className='flex items-center gap-3'>source Code <Button onClick={copySubmit}><Copy/></Button></DialogTitle>
            <DialogDescription className="max-sm:min-w-[200px]">
                <SyntaxHighlighter  language="javascript" style={coldarkCold}>{code}</SyntaxHighlighter>
             
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CodeView
