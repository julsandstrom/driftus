import type { Conversation } from "../context/ConversationsContext";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  conv: Conversation;
  isActive: boolean;
  setActiveId: (id: string) => void;
  onDelete?: (id: string) => void;
};

const ConversationItem = React.memo(
  function ConversationItem({ conv, isActive, setActiveId, onDelete }: Props) {
    const navigate = useNavigate();
    const select = () => {
      setActiveId(conv.id);
      navigate(`/chat?cid=${conv.id}`);
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
  },
  (a, b) =>
    a.conv.id === b.conv.id &&
    a.conv.title === b.conv.title &&
    a.isActive &&
    b.isActive
);

export default ConversationItem;
