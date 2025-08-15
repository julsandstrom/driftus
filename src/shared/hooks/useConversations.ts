// import { useState, useEffect } from "react";

// export type Conversation = { id: string; title: string };

// const KEY = "conversations";

// export function useConversations() {
//   const [conversations, setConversations] = useState<Conversation[]>(() => {
//     const raw = localStorage.getItem(KEY);
//     return raw ? JSON.parse(raw) : [];
//   });

//   const [activeId, setActiveId] = useState<string>(() => {
//     return localStorage.getItem("activeConversationId") || "";
//   });

//   useEffect(
//     () => localStorage.setItem(KEY, JSON.stringify(conversations)),
//     [conversations]
//   );

//   useEffect(
//     () => localStorage.setItem("activeConversationId", activeId),
//     [activeId]
//   );

//   function createConversation(title = "New Conversation") {
//     const id = crypto.randomUUID();
//     const conv = { id, title };
//     setConversations((cs) => [conv, ...cs]);
//     setActiveId(id);
//     console.log("creating a new conversation", conv.id);
//     return conv;
//   }

//   return { conversations, activeId, setActiveId, createConversation };
// }
