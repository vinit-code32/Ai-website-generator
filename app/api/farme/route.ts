import { db } from "@/app/config/db"
import { chats, frameTable, projectTable } from "@/app/config/Sechma"
import { and, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"


export const GET = async(req:NextRequest)=>{
    let {searchParams} = new URL(req.url)
    let farmeId = searchParams.get("farmeId")
    let projectId = searchParams.get("projectId")

    let farmeTable = await db.select().from(frameTable)
//@ts-ignore
    .where(eq(frameTable.farmeId,farmeId))
    let chat = await db.select().from(chats)
    //@ts-ignore
     .where(eq(chats.farmeId,farmeId))
    let result = {
        ...farmeTable[0],
        chatMessage:chat[0].chatMessages
    }
    return NextResponse.json({...result})
}



export const PUT = async(req:NextRequest)=>{

    let {farmeId,projectId,designCode} = await req.json()
    let res = await db.update(frameTable).set({
        designCode:designCode,
    }).where(and(eq(frameTable.farmeId,farmeId),eq(frameTable.projectId,projectId)))


    console.log(res);
    return NextResponse.json({reslut:"update"})
    
}