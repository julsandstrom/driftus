import type { Conversation } from "../context/ConversationsContext";

import { useNavigate } from "react-router-dom";

type Props = {
  conv: Conversation;
  isActive: boolean;
  setActiveId: (id: string) => void;
  onDelete?: (id: string) => void;
};

function ConversationItem({ conv, isActive, setActiveId, onDelete }: Props) {
  const navigate = useNavigate();
  const select = () => {
    setActiveId(conv.id);
    navigate(`/chat?conversationID=${conv.id}`);
  };
  const copyLink = async (id: string) => {
    await navigator.clipboard.writeText(id);
    alert("Länk kopierad");
  };

  return (
    <li>
      <div className="flex">
        <button
          onClick={select}
          className={`w-full text-left ${isActive ? "bg-gray-700" : ""}`}
          title={conv.id}
        >
          {conv.title}
        </button>{" "}
        <button onClick={() => copyLink(conv.id)} className="w-full text-left">
          Copy Link
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conv.id);
            }}
            title="Ta bort"
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}

export default ConversationItem;
