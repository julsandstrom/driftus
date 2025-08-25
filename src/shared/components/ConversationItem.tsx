import type { Conversation } from "../context/ConversationsContext";
import { Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConversations } from "../context/ConversationsContext";
import { Button } from "./Button";
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
              <Button
                variant="ghost"
                size="md"
                onClick={select}
                className={`w-full text-left rounded-xl h-11 flex justify-center mr-2${
                  isActive ? "bg-green-800 " : ""
                }`}
                title={conv.id}
              >
                {" "}
                {conv.title}
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => copyLink(conv.id)}
                className="w-full text-left rounded-xl "
              >
                Copy Link
              </Button>
              {onDelete && (
                <Button
                  variant="destructiveIcon"
                  size="icon"
                  aria-label={`Delete conversation${
                    conv.title ? ` “${conv.title}”` : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title="Delete"
                  className="bg-none"
                >
                  <Trash2Icon
                    aria-hidden="true"
                    focusable="false"
                    className="w-8 h-8"
                  />
                </Button>
              )}
            </div>
          ) : (
            <div className="flex rounded-xl flex-row gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={select}
                className={`w-full text-left rounded-xl h-11 flex justify-center  ${
                  isActive ? "bg-green-800 " : ""
                }`}
                title={conv.id}
              >
                {" "}
                {conv.title}
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => copyLink(conv.id)}
                className="w-full text-left rounded-xl hover:bg-yellow-600"
              >
                Copy Link
              </Button>
              {onDelete && (
                <Button
                  variant="destructiveIcon"
                  size="icon"
                  aria-label={`Delete conversation${
                    conv.title ? ` “${conv.title}”` : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title="Delete"
                  className="bg-none"
                >
                  <Trash2Icon
                    aria-hidden="true"
                    focusable="false"
                    className="w-8 h-8"
                  />
                </Button>
              )}
            </div>
          )}
        </li>
      ) : (
        <Button
          variant="primary"
          size="md"
          onClick={select}
          className={`w-full text-left rounded-xl h-11 flex justify-center  ${
            isActive ? "bg-green-800 " : ""
          }`}
          title={conv.id}
        >
          {" "}
          {conv.title}
        </Button>
      )}
    </>
  );
}

export default ConversationItem;
