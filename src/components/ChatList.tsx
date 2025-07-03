import type { Message } from "../types";

type Props = {
  messages: Message[];
  removeMessage: (id: string) => void;
};
const ChatList = ({ messages, removeMessage }: Props) => {
  return (
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
  );
};

export default ChatList;
