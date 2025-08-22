import type { Conversation } from "../context/ConversationsContext";

import { useNavigate } from "react-router-dom";
import { useConversations } from "../context/ConversationsContext";
type Props = {
  conv: Conversation;
  isActive: boolean;
  setActiveId: (id: string) => void;
  onDelete?: (id: string) => void;
  expanded: boolean;
};

function ConversationItem({
  conv,
  isActive,
  setActiveId,
  onDelete,
  expanded,
}: Props) {
  const navigate = useNavigate();

  const { conversations } = useConversations();

  const select = () => {
    setActiveId(conv.id);
    navigate(`/chat?conversationID=${conv.id}`);
  };
  const copyLink = async (id: string) => {
    await navigator.clipboard.writeText(id);
    alert("Länk kopierad");
  };

  const sharedConversation = conversations[0].title === "Chat";

  return (
    <>
      {expanded ? (
        <li className="">
          {sharedConversation ? (
            <div className="flex h-11">
              <button
                onClick={select}
                className={`w-full text-left px-2 rounded-xl  ${
                  isActive ? "bg-green-700 " : ""
                }`}
                title={conv.id}
              >
                {conv.title}
              </button>{" "}
              <button
                onClick={() => copyLink(conv.id)}
                className="w-full text-left px-2"
              >
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
          ) : (
            <div className="flex">
              <button
                onClick={select}
                className={`w-full text-left ${isActive ? "bg-green-700" : ""}`}
                title={conv.id}
              >
                {conv.title}
              </button>{" "}
              <button
                onClick={() => copyLink(conv.id)}
                className="w-full text-left"
              >
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
          )}
        </li>
      ) : (
        <button
          onClick={select}
          className={`w-full text-left ${isActive ? "bg-green-700" : ""}`}
          title={conv.id}
        >
          {conv.title}
        </button>
      )}
    </>
  );
}

export default ConversationItem;
