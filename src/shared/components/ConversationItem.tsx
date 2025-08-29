import type { Conversation } from "../context/ConversationsContext";
import { Trash2Icon, Copy } from "lucide-react";
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
          className={`w-full rounded-xl h-24 pr-2  text-[#1A1A1A]  list-none flex flex-col items-start ${
            isActive ? "bg-[#BE9C3D]  text-[#1A1A1A] " : ""
          }`}
        >
          {sharedConversation ? (
            <>
              <Button
                variant={`${!isActive ? "ghost" : "subtle"}`}
                size="md"
                onClick={select}
                className={`w-full text-left text-xs sm:text-base rounded-xl h-11 flex justify-center mr-2 place-self-center
                }`}
                title={conv.id}
              >
                {" "}
                {conv.title}
              </Button>
              <div className="flex  justify-center items-center self-center">
                <Button
                  variant={`${!isActive ? "ghost" : "subtle"}`}
                  size="md"
                  onClick={() => copyLink(conv.id)}
                  className="w-full text-left rounded-xl "
                  aria-label={`Copy conversation Link`}
                  title="Copy Link"
                >
                  <Copy
                    aria-hidden="true"
                    focusable="false"
                    className="lg:w-10 lg:h-10"
                  />
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
                      className="w-7 h-7 md:w-10 lg:h-10"
                    />
                  </Button>
                )}
              </div>
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

              <div className="flex  md:gap-11 justify-center items-center self-center ">
                <Button
                  variant="subtle"
                  size="md"
                  onClick={() => copyLink(conv.id)}
                  className=" rounded-xl text-center w-[60px]"
                >
                  <Copy
                    aria-hidden="true"
                    focusable="false"
                    className="lg:w-10 lg:h-10"
                  />
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
                      className="w-7 h-7 md:w-10 lg:h-10"
                    />
                  </Button>
                )}
              </div>
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
