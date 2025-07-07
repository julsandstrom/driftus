import ChatList from "../components/ChatList";
import InputField from "../../../shared/components/InputField";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useChat } from "../hooks/useChat";
import UserContainer from "../../user/containers/UserContainer";
const ChatContainer = () => {
  const { user } = useAuth();

  const { messages, newMessage, setNewMessage, sendMessage, removeMessage } =
    useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(e);
  };

  return (
    <div>
      {user?.avatar && <img src={`${user?.avatar}`} alt="avatar" />}
      User: <UserContainer />
      <ChatList messages={messages} removeMessage={removeMessage} />
      <form onSubmit={handleSubmit}>
        <InputField
          label={user?.user}
          name="chat"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatContainer;
