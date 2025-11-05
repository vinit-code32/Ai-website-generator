
import { db } from '@/app/config/db';
import { chats } from '@/app/config/Sechma';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';



export const PUT = async(req:NextRequest)=>{
    let {message,farmeId}= await req.json()
    console.log(message,farmeId);
    
    let res = await db.update(chats).set({
        chatMessages:message,
    }).where(eq(chats.farmeId,farmeId))

    console.log(res);

    return NextResponse.json({...res})
    
}