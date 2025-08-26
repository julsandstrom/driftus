import type { Conversation } from "../context/ConversationsContext";
import { Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConversations } from "../context/ConversationsContext";
import { Button } from "./Button";

type Props = {
  conv: Conversation;

  onDelete?: (id: string) => void;
  expanded: boolean;
};

function ConversationItem({ conv, onDelete, expanded }: Props) {
  const navigate = useNavigate();

  const { conversations, activeId, setActiveId } = useConversations();

  const select = () => {
    setActiveId(conv.id);

    navigate(`/chat?conversationID=${conv.id}`);
  };
  const copyLink = async (id: string) => {
    await navigator.clipboard.writeText(id);
    alert("Länk kopierad");
  };

  const isActive = activeId === conv.id;
  const sharedConversation = conversations[0].title === "Chat";

  return (
    <>
      {expanded ? (
        <li
          className={`w-full rounded-xl h-14  text-[#1A1A1A] px-4 mb-2 list-none flex justify-between ${
            isActive ? "bg-white  text-[#1A1A1A] " : ""
          }`}
        >
          {sharedConversation ? (
            <>
              <Button
                variant={`${!isActive ? "ghost" : "subtle"}`}
                size="md"
                onClick={select}
                className={`w-full text-left rounded-xl h-11 flex justify-center mr-2 place-self-center
                }`}
                title={conv.id}
              >
                {" "}
                {conv.title}
              </Button>

              <Button
                variant={`${!isActive ? "ghost" : "subtle"}`}
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
                    conv.title ? ` "${conv.title}"` : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title="Delete"
                  className={`bg-none ${
                    !isActive ? "ghost text-white" : "subtle"
                  }`}
                >
                  <Trash2Icon
                    aria-hidden="true"
                    focusable="false"
                    className="w-8 h-8"
                  />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="subtle"
                size="md"
                onClick={select}
                className={` text-left rounded-xl h-11 flex justify-center place-self-center  ${
                  isActive ? " " : ""
                }`}
                title={conv.id}
              >
                {" "}
                {conv.title}
              </Button>

              <Button
                variant="subtle"
                size="md"
                onClick={() => copyLink(conv.id)}
                className=" rounded-xl text-center w-[60px]"
              >
                Copy Link
              </Button>
              {onDelete && (
                <Button
                  variant="destructiveIcon"
                  size="icon"
                  aria-label={`Delete conversation${
                    conv.title ? ` "${conv.title}"` : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title="Delete"
                  className="bg-none "
                >
                  <Trash2Icon
                    aria-hidden="true"
                    focusable="false"
                    className="w-8 h-8"
                  />
                </Button>
              )}
            </>
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
