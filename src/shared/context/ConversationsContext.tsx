import React, { createContext, useContext, useEffect, useState } from "react";

export type Conversation = { id: string; title: string; shared?: boolean };

type Ctx = {
  conversations: Conversation[];
  activeId: string;
  setActiveId: (id: string) => void;
  createConversation: (title?: string) => Conversation;
  deleteConversation: (id: string) => void;
  ensureConversation: (id: string, title: string) => void;
  joinById: () => void;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
};

const ConversationsContext = createContext<Ctx | null>(null);

const KEY_LIST = "conversations";
const KEY_ACTIVE = "activeConversationId";

export function ConversationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const raw = localStorage.getItem(KEY_LIST);
    return raw ? JSON.parse(raw) : [];
  });
  const [activeId, setActiveId] = useState<string>(() => {
    return localStorage.getItem(KEY_ACTIVE) || "";
  });

  useEffect(() => {
    localStorage.setItem(KEY_LIST, JSON.stringify(conversations));
  }, [conversations]);
  useEffect(() => {
    localStorage.setItem(KEY_ACTIVE, activeId);
  }, [activeId]);

  useEffect(() => {
    if (!activeId && conversations.length > 0) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  const joinById = () => {
    const id = prompt("Klistra in conversationId (GUID):")?.trim();
    if (!id) return;

    if (!(id.length === 36 && id.split("-").length === 5))
      return alert("Ogiltigt ID");

    ensureConversation(id, "Shared");
  };

  function createConversation(title = "Chat") {
    const id = crypto.randomUUID();
    const conv = { id, title };
    setConversations((cs) => [conv, ...cs]);
    setActiveId(id);
    return conv;
  }

  function deleteConversation(id: string) {
    setConversations((prev) => {
      const updatedConv = prev.filter((s) => s.id !== id);

      setActiveId((curr) => (curr === id ? updatedConv[0]?.id ?? "" : curr));
      return updatedConv;
    });
  }

  function ensureConversation(id: string, title = "Shared") {
    setConversations((prev) => {
      if (prev.some((c) => c.id === id)) return prev;
      return [{ id, title }, ...prev];
    });
    setActiveId(id);
  }

  const value = {
    conversations,
    activeId,
    setActiveId,
    joinById,
    createConversation,
    setConversations,
    deleteConversation,
    ensureConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx)
    throw new Error(
      "useConversations must be used within <ConversationsProvider>"
    );
  return ctx;
}
