import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
type Message = {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  conversationId: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const { user } = useAuth();
  const [conversationId] = useState(() => {
    return uuidv4();
  });
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) console.log("error, missing token");

      const res = await fetch("https://chatify-api.up.railway.app/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("https://chatify-api.up.railway.app/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

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
        text: newMessage,
        conversationId,
      }),
    });

    if (res.ok) {
      setNewMessage("");
      await fetchMessages();
      console.log("message sent and refetched!");
    } else {
      const err = res.json();
      console.log("failed to send", err);
    }
  };

  const removeMessage = async (id: string) => {
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
  const lastMessage = messages[messages.length - 1];
  return (
    <div>
      <img src={`${user?.avatar}`} />
      {lastMessage ? (
        <p
          key={lastMessage.id}
          onClick={() => removeMessage(lastMessage.id)}
          style={{ border: "1px solid green" }}
        >
          {lastMessage.text}
        </p>
      ) : (
        <p>Start a conversation</p>
      )}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
