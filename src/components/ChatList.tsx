import type { Message } from "../types";

type Props = {
  messages: Message[];
  deleteMessage: (e: string) => void;
};

const ChatList = ({ messages, deleteMessage }: Props) => {
  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg.id} onClick={() => deleteMessage(msg.id)} role="button">
          {msg.text}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
