import React, { useEffect, useState } from "react";

import type { Message } from "../../../shared/types";
import type { FlashKind } from "./ChatContext";
import { useSearchParams } from "react-router-dom";
import { sanitize } from "../../../shared/utils/sanitize";
import { ValidateWithErrors } from "../validators/chatValidator";
import ChatContext from "./ChatContext";
import { useConversations } from "../../../shared/context/ConversationsContext";
import { getUserById } from "../../../shared/api/chatify";
import {
  getMessages,
  createMessage,
  deleteMessage,
} from "../../../shared/api/chatify";
import { useAuth } from "../../../shared/hooks/useAuth";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const { activeId, setConversations } = useConversations();
  const [peerName, setPeerName] = useState<string>("");

  const [flashText, setFlashText] = useState<string | null>(null);
  const [flashKind, setFlashKind] = useState<FlashKind>("info");

  const [sp, setSp] = useSearchParams();
  const { user } = useAuth();

  function showFlash(kind: FlashKind, text: string, ms = 1500): void {
    setFlashKind(kind);
    setFlashText(text);
    if (ms > 0) setTimeout(() => setFlashText(null), ms);
  }

  async function updatePeerName(msgs: Message[]) {
    const myId = String(user?.id ?? "");

    const others = Array.from(
      new Set(
        msgs.map((m) => String(m.userId)).filter((uid) => uid && uid !== myId)
      )
    );

    if (others.length === 1) {
      try {
        const u = await getUserById(others[0]);
        const name = u?.username ?? u?.user ?? "";
        setPeerName(name);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId && !c.shared
              ? {
                  ...c,
                  shared: true,
                  title:
                    c.title === "Chat" || c.title === "Shared Conversation"
                      ? name
                      : c.title,
                }
              : c
          )
        );
      } catch {
        setPeerName("");
      }
    } else {
      console.log(others.length);
      setPeerName("");
    }
  }

  const fetchMessages = async () => {
    if (!activeId) return;
    try {
      const data = await getMessages(activeId);
      const list = Array.isArray(data) ? data : [];
      updatePeerName(list);
      setMessages(list);
      showFlash("success", "Loaded messages!", 2000);
    } catch (err) {
      console.log("Failed to load messages", err);
      showFlash("error", "Failed to load messages", 2000);
      setMessages([]);
      setPeerName("");
    }
  };

  useEffect(() => {
    const cid = sp.get("conversationID");
    if (activeId && cid !== activeId) {
      setSp({ conversationID: activeId }, { replace: true });
    } else if (!activeId && cid) {
      setSp({}, { replace: true });
    }
  }, [activeId]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    fetchMessages();
    setInputError("");
    console.log("fetched messages");
  }, [activeId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeId) {
      alert("no active id");
      setInputError("");
      return;
    }

    const cleanInput = sanitize(newMessage);
    const errorMessage = ValidateWithErrors(cleanInput);

    if (errorMessage.length > 0) {
      setInputError(errorMessage[0]);
      return;
    }

    setInputError("");

    try {
      const sent = await createMessage(cleanInput, activeId);
      setNewMessage("");
      setMessages((prev) => [...prev, sent]);
      await fetchMessages();
      showFlash("success", "Sent successfully", 1200);
    } catch (err) {
      console.log("failed to send", err);
      showFlash("error", "Failed to send", 2000);
    }
  };

  const removeMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => String(m.id) !== String(id)));
      showFlash("success", "Deleted message!");
    } catch (err) {
      showFlash("error", "Failed to delete message...");
      console.log("Failed to delete message", err);
    }
  };
  return (
    <ChatContext.Provider
      value={{
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        removeMessage,
        inputError,
        fetchMessages,
        peerName,
        flashKind,
        flashText,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// useEffect(() => {
//   const cid = sp.get("conversationID");

//   if (!cid || !UUID_RE.test(cid)) return;
//   if (activeId !== cid) setActiveId(cid);

//   if (conversations.some((c) => c.id == cid)) {
//     console.log("here ");
//     ensureConversation(cid, "Shared Conversation");
//   }
// }, [sp.toString()]);
