import { createContext } from "react";
import type { Message } from "../../../shared/types/Message";

export type FlashKind = "info" | "success" | "error";

type ChatContextType = {
  messages: Message[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  inputError: string;
  sendMessage: (e: React.FormEvent) => void;
  removeMessage: (id: string) => void;
  fetchMessages: () => void;
  peerName: string;
  flashKind: FlashKind;
  flashText: string | null;
};

const ChatContext = createContext<ChatContextType | null>(null);

export default ChatContext;
