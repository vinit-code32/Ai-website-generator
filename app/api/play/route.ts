import { db } from "@/app/config/db";
import { chats, frameTable, projectTable } from "@/app/config/Sechma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export const POST = async(req:NextRequest)=>{
    let user= await currentUser()
    const {projectId,farmeId,message} = await req.json()
    const project = await db.insert(projectTable).values({

        projectId,
        createdBy:user?.primaryEmailAddress?.emailAddress
    })
    let Frame = await db.insert(frameTable).values({
        
        farmeId:farmeId,
        projectId
    })
    
    let chts = await db.insert(chats).values({

        chatMessages:[message],
        farmeId,
        createdBy:user?.primaryEmailAddress?.emailAddress
    })

    return NextResponse.json({projectId,farmeId,message})
}