import { useConversations } from "../../../shared/context/ConversationsContext";
import ChatContainer from "../containers/ChatContainer";

const Chat = () => {
  // const lastMessage = messages[messages.length - 1];
  const { activeId } = useConversations();
  return (
    <>
      <ChatContainer key={activeId} />
    </>
  );
};

export default Chat;
