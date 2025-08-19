import ChatList from "../components/ChatList";
import InputField from "../../../shared/components/InputField";

import { useChat } from "../hooks/useChat";

import SideNav from "../../../shared/components/sideNav";
import { BarChart3, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useConversations } from "../../../shared/context/ConversationsContext";

const ChatContainer = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    removeMessage,
    peerName,
  } = useChat();

  const { conversations } = useConversations();

  const { logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(e);
  };

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
            text="Chat"
            to="/chat"
            end
          />
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

          <ChatList messages={messages} removeMessage={removeMessage} />
          {conversations.length > 0 && (
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
          )}
        </main>
      </div>
    </>
  );
};

export default ChatContainer;
