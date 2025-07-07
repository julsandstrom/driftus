import { createContext } from "react";
import type { Message } from "../../types";

type ChatContextType = {
  messages: Message[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  inputError: string;
  sendMessage: (e: React.FormEvent) => void;
  removeMessage: (id: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export default ChatContext;
