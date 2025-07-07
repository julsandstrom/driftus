import type { Message } from "../../../shared/types";
import { useChat } from "../hooks/useChat";
type Props = {
  messages: Message[];
  removeMessage: (id: string) => void;
};
const ChatList = ({ messages, removeMessage }: Props) => {
  const { inputError } = useChat();

  return (
    <div>
      {inputError && (
        <h1 style={{ fontSize: "16px", color: "red" }}>{inputError}</h1>
      )}
      <ul>
        {messages.map((msg) => {
          return (
            <li
              key={msg.id}
              onClick={() => removeMessage(msg.id)}
              style={{ border: "1px solid white" }}
            >
              {msg.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
