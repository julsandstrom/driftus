import React, { useEffect, useState } from "react";

import type { Message } from "../../../shared/types";

import { sanitize } from "../../../shared/utils/sanitize";
import { ValidateWithErrors } from "../validators/chatValidator";
import ChatContext from "./ChatContext";
import { useConversations } from "../../../shared/context/ConversationsContext";
import {
  getMessages,
  createMessage,
  deleteMessage,
} from "../../../shared/api/chatify";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const { activeId } = useConversations();

  const fetchMessages = async () => {
    if (!activeId) return;
    try {
      const data = await getMessages(activeId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Failed to load messages", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeId) {
      alert("no active id");
      return;
    }
    alert(activeId);

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
