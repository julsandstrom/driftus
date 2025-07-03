import ChatList from "./ChatList";
import InputField from "./InputField";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../components/useChat";
import UserContainer from "./UserContainer";
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
      <img src={`${user?.avatar}`} />
      <UserContainer />
      <ChatList messages={messages} removeMessage={removeMessage} />
      <form onSubmit={handleSubmit}>
        <InputField
          label={user?.user}
          name="chat"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />{" "}
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatContainer;
