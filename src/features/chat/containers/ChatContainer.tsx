import ChatList from "../components/ChatList";
import InputField from "../../../shared/components/InputField";
// import { useAuth } from "../../../shared/hooks/useAuth";
import { useChat } from "../hooks/useChat";
import UserContainer from "../../user/containers/UserContainer";
import SideNav from "../../../shared/components/sideNav";
import { BarChart3, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";
import { useNavigate } from "react-router-dom";

const ChatContainer = () => {
  // const { user } = useAuth();
  const navigate = useNavigate();
  const { messages, newMessage, setNewMessage, sendMessage, removeMessage } =
    useChat();

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
            onClick={() => navigate("/profile")}
          />{" "}
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Chat"
            onClick={() => navigate("/chat")}
          />
          <SidebarItem icon={<UserCircle size={20} />} text="Log Out" />
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
