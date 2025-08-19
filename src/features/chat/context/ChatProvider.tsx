import React, { useEffect, useState } from "react";

import type { Message } from "../../../shared/types";
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const { activeId, ensureConversation } = useConversations();
  const [peerName, setPeerName] = useState<string>("");

  const [sp, setSp] = useSearchParams();
  const { user } = useAuth();

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
    } catch (err) {
      console.log("Failed to load messages", err);
      setMessages([]);
      setPeerName("Ny konversation");
    }
  };

  useEffect(() => {
    const cid = sp.get("conversationID");

    if (!cid || !UUID_RE.test(cid)) return;

    if (activeId && cid !== activeId) {
      setSp({ cid: activeId }, { replace: true });
    } else if (!activeId && cid) {
      setSp({}, { replace: true });
    }

    ensureConversation(cid, "Shared Conversation");
  }, [sp, activeId, ensureConversation]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    fetchMessages();
    setInputError("");
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
      console.log("message sent", sent.text);
    } catch (err) {
      console.log("failed to send", err);
    }
  };

  const removeMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => String(m.id) !== String(id)));
    } catch (err) {
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
