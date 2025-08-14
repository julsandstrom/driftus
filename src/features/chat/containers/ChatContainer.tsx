import ChatList from "../components/ChatList";
import InputField from "../../../shared/components/InputField";

import { useChat } from "../hooks/useChat";
import UserContainer from "../../user/containers/UserContainer";
import SideNav from "../../../shared/components/sideNav";
import { BarChart3, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";
import { useAuth } from "../../../shared/hooks/useAuth";
const ChatContainer = () => {
  const { messages, newMessage, setNewMessage, sendMessage, removeMessage } =
    useChat();

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
          <div className="mb-4 flex">
            <UserContainer />
          </div>

          <ChatList messages={messages} removeMessage={removeMessage} />
          <form onSubmit={handleSubmit} className="flex justify-center">
            <InputField
              name="chat"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Try writing something"
            />
            <button type="submit">Send</button>
          </form>
        </main>
      </div>
    </>
  );
};

export default ChatContainer;
