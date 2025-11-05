

import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


import { eq, inArray } from "drizzle-orm";
import { db } from "@/app/config/db";
import { chats, frameTable, projectTable } from "@/app/config/Sechma";

export async function GET(req: NextRequest) {
    const user = await currentUser();
    // Get the project

    //@ts-ignore
    const projects = await db.select().from(projectTable).where(eq(projectTable.createdBy, user?.primaryEmailAddress?.emailAddress));

    let results: {
        projectId: string;
        farmeId: string;
        chats: { id: number; chatMessage: any; createdBy: string; createdOn: Date }[];
    }[] = [];

    for (const project of projects) {
        const farmes = await db
            .select({ farmeId: frameTable.farmeId })
            .from(frameTable)
            //@ts-ignore
            .where(eq(frameTable.projectId, project.projectId));

        // Fetch chats for all frames in this project in one query
        const farmeIds = farmes.map((f: any) => f.farmeId);
        let chatsData: any[] = [];
        if (farmeIds.length > 0) {
            chatsData = await db
                .select()
                .from(chats)
                .where(inArray(chats.farmeId, farmeIds));
        }

        // Combine: attach chats to each frame
        for (const frame of farmes) {
            results.push({
                projectId: project.projectId ?? '',
                farmeId: frame.farmeId ?? '',
                chats: chatsData.filter((c) => c.farmeId === frame.farmeId),
            });
        }
    }

    return NextResponse.json(results);
}

