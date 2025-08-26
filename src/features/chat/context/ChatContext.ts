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
  showFlash: (kind: FlashKind, text: string) => void;
  isFocused: boolean;
  sendingStatus: boolean;
  setIsFocused: (v: boolean) => void;
  aiTipRecieved: boolean;
  setAiTipRecieved: (s: boolean) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export default ChatContext;
