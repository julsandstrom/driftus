import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Conversation = { id: string; title: string };

type Ctx = {
  conversations: Conversation[];
  activeId: string;
  setActiveId: (id: string) => void;
  createConversation: (title?: string) => Conversation;
  deleteConversation: (id: string) => void;
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

  function createConversation(title = "Ny konversation") {
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

  const value = useMemo(
    () => ({
      conversations,
      activeId,
      setActiveId,
      createConversation,
      setConversations,
      deleteConversation,
    }),
    [conversations, activeId]
  );

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
