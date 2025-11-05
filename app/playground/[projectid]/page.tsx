"use client";
import React, { useEffect, useState } from "react";
import Header from "../_comeponenet/Header";
import Desgin from "../_comeponenet/Desgin";
import ChatSessin from "../_comeponenet/ChatSessin";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

type Result = {
  projectId: string;
  farmeId: string;
  chatMessage: Message[];
  designCode?: string;
};

export type Message = {
  role: string;
  content: string;
};

const Page = () => {
  const [data, setData] = useState<Result>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const { projectid } = useParams();
  const searchParams = useSearchParams();
  const res = searchParams.get("farme");

  // 🟦 Fetch initial frame data
  useEffect(() => {
    if (res) fetchResult();
  }, [res]);

  const fetchResult = async () => {
    const { data } = await axios.get(`/api/farme?farmeId=${res}&projectId=${projectid}`);
    setData(data);

    const code = data?.designCode || "";
   const cleanedCode = code
  .replace(/```html|```/g, "")
  .trim();

    setGeneratedCode(cleanedCode);

    if (data.chatMessage?.length === 1) {
      handleSubmit(data.chatMessage[0].content);
    } else {
      setMessages(data.chatMessage || []);
    }
  };

  // 🧩 AI prompt
 const prompt = `
userInput: {userInput}

Instructions:

1. If the user input explicitly asks to generate code, design, or HTML/CSS/JS output (for example: "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then generate a complete HTML body using Tailwind CSS and Flowbite UI components that follows these rules:

   - Produce only the <body> content (do not include <head>,  <html> , or <title>) .
   - Use a modern design with **blue as the primary color theme**. All primary components must match the theme color.
   - Provide proper spacing (padding and margin) for each element.
   - Components should be independent (do not connect interactive components to external backends).
   - Use placeholders for all images:
     - Light mode placeholder: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
     - Dark mode placeholder: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
     - Add descriptive alt attributes for all images matching the image prompt.
   - Use the following libraries/components where appropriate:
     - FontAwesome icons (fa fa-...)
     - Flowbite components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.
     - Chart.js for charts and graphs
     - Swiper.js for sliders/carousels
     - Tippy.js for tooltips and popovers
   - Include interactive components such as modals, dropdowns, and accordions (structure them so they can be activated, but do not require external services).
   - Ensure charts are visually appealing and match the theme color.
   - Header menu options should be spaced out and not visually connected.
   - Do not include broken or dead links.
   - Do not add any extra text before or after the HTML code.

2. If the user input is general text or greetings (for example: "Hi", "Hello", "How are you?") or does not explicitly request code or design, then respond with a brief, friendly textual reply instead of generating code.
`


  // 🟩 Handle submit
  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;

    setLoading(true);
    const newUserMsg = { role: "user", content: input };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    try {
      // reset old code before new generation
      if (generatedCode.trim().length > 0) {
  setGeneratedCode(""); // only clear if something exists
}

      const res = await fetch("/api/website", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt.replace("{userInput}", input) }],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let isCode = false;

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;
if (
  !isCode &&
  (aiResponse.includes("<body") ||
    aiResponse.includes("<div") ||
    aiResponse.includes("<section") ||
    aiResponse.includes("```html"))
) {
  isCode = true;
}

// If it's code, append to design UI
if (isCode) {
  setGeneratedCode((prev) => prev + chunk);
}
      }

      const newAIMessage: Message = {
        role: "ai",
        content: isCode ? "✅ Code generated successfully!" : aiResponse,
      };

      const finalMessages = [...updatedMessages, newAIMessage];
      setMessages(finalMessages);

      // Save chat and design
      await saveMessages(finalMessages);
      if (isCode) await saveGeneratedCode(aiResponse);

      // 🔁 Refetch updated design from DB after save
      await fetchUpdatedDesign();

    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  // 🟩 Save chat to DB
  const saveMessages = async (updatedMessages: Message[]) => {
    const result = await axios.put("/api/chat", {
      message: updatedMessages,
      farmeId: res,
    });
    console.log("💾 Saved messages:", result.data);
  };
useEffect(() => {
  if (generatedCode) {
    console.log("🧠 Current Generated HTML:");
    console.log(generatedCode);
  }
}, [generatedCode]);

  // 🟩 Save code to DB
  const saveGeneratedCode = async (code: string) => {
    const result = await axios.put("/api/farme", {
      designCode: code,
      farmeId: res,
      projectId: projectid,
    });
    console.log("💾 Code saved:", result.data);
    toast.success("Website ready!");
  };

  // 🟩 Fetch updated design after any new message
  const fetchUpdatedDesign = async () => {
    try {
      const { data } = await axios.get(`/api/farme?farmeId=${res}&projectId=${projectid}`);
      const code = data?.designCode || "";
     const cleanedCode = code
  .replace(/```html|```/g, "")
  .trim();
      setGeneratedCode(cleanedCode);
      console.log("♻️ Refetched latest design from DB");
    } catch (error) {
      console.error("⚠️ Failed to fetch updated design", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex h-full">
        <ChatSessin
          message={messages}
          onSend={handleSubmit}
          loading={isLoading}
        />
      <Desgin generateCode={generatedCode?.replace("```", "") || "<div class='p-10 text-center'>No design yet</div>"} />

      </div>
    </div>
  );
};

export default Page;
