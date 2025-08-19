import { createContext } from "react";
import type { Message } from "../../../shared/types/Message";

type ChatContextType = {
  messages: Message[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  inputError: string;
  sendMessage: (e: React.FormEvent) => void;
  removeMessage: (id: string) => void;
  fetchMessages: () => void;
  peerName: string;
};

const ChatContext = createContext<ChatContextType | null>(null);

export default ChatContext;
