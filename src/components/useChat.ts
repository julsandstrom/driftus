import React, { useEffect, useState } from "react";
import { isSafeText } from "../utils/sanitize";
import type { Message } from "../types";
import { v4 as uuidv4 } from "uuid";
import { sanitize } from "../utils/sanitize";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [conversationId] = useState(() => {
    const saved = localStorage.getItem("conversationId");
    const newId = saved || uuidv4();
    if (!saved) localStorage.setItem("conversationId", newId);

    return newId;
  });

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(
      `https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    console.log("Fetched messages raw response:", data);
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanInput = sanitize(newMessage);
    if (!isSafeText(cleanInput)) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("https://chatify-api.up.railway.app/messages", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: cleanInput,
        conversationId,
      }),
    });

    try {
      setNewMessage("");
      await fetchMessages();
    } catch {
      const err = res.json();
      console.log("failed to send", err);
    } finally {
      console.log("message sent and refetched!");
    }
  };

  const removeMessage = async (id: string) => {
    console.log("removeMessage called with ID:", id);
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(
      `https://chatify-api.up.railway.app/messages/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
    } else {
      const err = await res.json();
      console.log("Failed to delete message", err);
    }
  };
  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    removeMessage,
  };
};
