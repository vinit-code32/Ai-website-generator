"use server"
import { db } from "@/app/config/db";
import { data } from "@/app/config/Sechma";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req:NextRequest)=>{
    let user = await currentUser()
   
    let res = await db.select().from(data)
     //@ts-ignore
    .where(eq(data.email,user?.primaryEmailAddress?.emailAddress))

    if(res?.length==0){
        let value = {
            name:user?.fullName,
            email:user?.primaryEmailAddress?.emailAddress,
            creadit:2
        }
     let insert=await db.insert(data).values({
        ...value})

     return NextResponse.json(insert)
    }
    return NextResponse.json({"data":res[0]})
} 