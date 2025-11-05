import { integer, json, pgTable, primaryKey, text, timestamp, varchar, } from "drizzle-orm/pg-core";



 export let data = pgTable("user",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    name:varchar({length:255}).notNull(),
    email:varchar({length:200}).notNull().unique(),
    creadit:integer().default(2)
})


 export let projectTable = pgTable("project",{
     id:integer().primaryKey().generatedAlwaysAsIdentity(),
     projectId:varchar(),
     createdBy:varchar().references(()=>data.email),
     CreatedOn:timestamp().defaultNow()

 }) 

 export let frameTable = pgTable("frame",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    farmeId:varchar(),
    designCode:text(),
    projectId:varchar().references(()=>projectTable.projectId),
 CreatedOn:timestamp().defaultNow()
 })

 export let chats = pgTable("chats",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    chatMessages:json(),
    farmeId:varchar().references(()=>frameTable.farmeId),
    createdBy:varchar().references(()=>data.email),
     CreatedOn:timestamp().defaultNow()

 })