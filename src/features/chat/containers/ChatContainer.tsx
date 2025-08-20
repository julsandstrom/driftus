import ChatList from "../components/ChatList";
import InputField from "../../../shared/components/InputField";

import { useChat } from "../hooks/useChat";

import SideNav from "../../../shared/components/sideNav";
import { BarChart3, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useConversations } from "../../../shared/context/ConversationsContext";
import { StatusBar } from "../components/StatusBar";

import type { Message } from "../../../shared/types";
import { useMemo } from "react";

const ChatContainer = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    removeMessage,
    peerName,
    flashKind,
    flashText,
    fetchMessages,
  } = useChat();

  const { conversations } = useConversations();

  const { logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(e);
  };

  function latestPerUser(msgs: Message[]): Message[] {
    const seen = new Set<string>();
    const out: Message[] = [];

    for (let i = msgs.length - 1; i >= 0; i--) {
      const m = msgs[i];
      const uid = String((m as any).userId ?? "");
      if (!uid) continue;
      if (!seen.has(uid)) {
        seen.add(uid);
        out.push(m);
      }
    }

    return out.reverse();
  }
  const uniqueLatest = useMemo(() => latestPerUser(messages), [messages]);

  return (
    <>
      <div className="flex h-screen fixed left-0 top-0 ml-[width]">
        <SideNav>
          <SidebarItem
            icon={<BarChart3 size={20} />}
            text="Profile"
            to="/profile"
            end
          />{" "}
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Log Out"
            onClick={logout}
          />
        </SideNav>

        <main className="flex-1 overflow-y-auto p-4">
          {peerName && (
            <div className="mb-4 flex">Conversation with: {peerName}</div>
          )}

          <ChatList messages={uniqueLatest} removeMessage={removeMessage} />
          {conversations.length > 0 && (
            <>
              <form onSubmit={handleSubmit} className="flex justify-center">
                <InputField
                  name="chat"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Try writing something"
                />
                <button type="submit">Send</button>
                <span></span>
              </form>
              {messages.length >= 1 && (
                <button onClick={fetchMessages}>Load Messages</button>
              )}
            </>
          )}
        </main>
        <StatusBar text={flashText} kind={flashKind} />
      </div>
    </>
  );
};

export default ChatContainer;
