import { useConversations } from "../../../shared/context/ConversationsContext";
import type { Message } from "../../../shared/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useChat } from "../hooks/useChat";
type Props = {
  messages: Message[];
  removeMessage: (id: string) => void;
};
const ChatList = ({ messages, removeMessage }: Props) => {
  const { inputError, fetchMessages } = useChat();

  const { activeId } = useConversations();
  const { user } = useAuth();

  if (!activeId) return null;

  return (
    <div>
      {inputError && (
        <h1 style={{ fontSize: "16px", color: "red" }}>{inputError}</h1>
      )}
      <ul>
        {messages.map((msg) => {
          const mine = String(msg.userId) === String(user?.id);

          return (
            <li
              key={`${msg.conversationId}:${msg.id}`}
              style={{ border: "1px solid white" }}
            >
              <span> {msg.text}</span>{" "}
              {mine && (
                <button
                  type="button"
                  onClick={() => removeMessage(msg.id)}
                  className="ml-2 opacity-70 hover:opacity-100"
                >
                  🗑️
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <button onClick={fetchMessages}>Load Messages</button>
    </div>
  );
};

export default ChatList;
