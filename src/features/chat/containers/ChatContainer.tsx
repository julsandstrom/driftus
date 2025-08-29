import { useChat } from "../hooks/useChat";

import SideNav from "../../../shared/components/sideNav";
import { LogOut, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useConversations } from "../../../shared/context/ConversationsContext";

import type { Message } from "../../../shared/types";
import { useMemo, useState, useEffect } from "react";
import { StatusBar } from "../components/StatusBar";
import { Button } from "../../../shared/components/Button";
import MessagePair from "../components/MessagePair";
import Composer from "../components/Composer";
import MainIcon from "../../../shared/components/MainIcon";

const ChatContainer = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    peerName,
    inputError,

    setIsFocused,
    flashKind,
    flashText,
  } = useChat();

  const [tips, setTips] = useState<string[]>([]);
  const [energy, setEnergy] = useState(0);
  const [sentiment, setSentiment] = useState<
    "positive" | "neutral" | "negative" | ""
  >("");
  const [aiLoading, setAiLoading] = useState(false);

  const [showAiError, setShowAiError] = useState(false);
  const [glow, setGlow] = useState(false);

  const { conversations, activeId, createConversation, joinById } =
    useConversations();

  const { logout, user } = useAuth();

  const myId = String(user?.id ?? "");

  const pinClass = moodColor(sentiment, energy);

  async function suggestReply(source: string, maxWords = 12) {
    setGlow(true);
    const r = await fetch("/.netlify/functions/suggest-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastMessage: source, maxWords }),
    });
    if (!r.ok) {
      setShowAiError(true);
      setTimeout(() => {
        setShowAiError(false);
      }, 3000);
      throw new Error("Suggest failed");
    }
    return r.json() as Promise<{
      sentiment: string;
      energy: number;
      suggestions: string[];
    }>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(e);
    setTips([]);
    setSentiment("");
    setEnergy(0);
    setGlow(false);
    setShowAiError(false);
  };

  function getLatestMessage(messages: Message[], myId: string) {
    let lastMine: Message | null = null;
    let lastTheirs: Message | null = null;

    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      const uid = String(m.userId ?? "");
      if (!uid) continue;

      if (!lastMine && uid === myId) lastMine = m;
      else if (!lastTheirs && uid !== myId) lastTheirs = m;

      if (lastMine && lastTheirs) break;
    }
    return { lastMine, lastTheirs };
  }
  useEffect(() => {
    setTips([]);
    setSentiment("");
    setEnergy(0);
    setGlow(false);
    setShowAiError(false);
  }, [activeId]);

  const { lastMine, lastTheirs } = useMemo(
    () => getLatestMessage(messages, myId),
    [messages, myId]
  );

  function moodColor(sentiment: string | undefined, energy: number) {
    if (sentiment === "negative" && energy >= 0.5) return "text-red-500";
    if (sentiment === "negative" && energy >= 0.01) return "text-yellow-500";

    if (sentiment === "neutral" && energy >= 0.5) return "text-yellow-500";
    if (sentiment === "neutral" && energy >= 0.01) return "text-yellow-500";

    if (sentiment === "positive" && energy >= 0.1) return "text-green-500";
    if (sentiment === "positive" && energy >= 0.5) return "text-green-500";

    return "text-zinc-500";
  }

  function moodLabel(sentiment: string | undefined, energy: number) {
    if (sentiment === "negative" && energy >= 0.5)
      return "Critical tone - stay calm.";
    if (sentiment === "negative" && energy >= 0.01)
      return "Irritated tone - show empathy";

    if (sentiment === "neutral" && energy >= 0.5)
      return "Slightly tense tone - reply calmly and clearly.";
    if (sentiment === "neutral" && energy >= 0.1)
      return "Neutral - here are some suggestions:";

    if (sentiment === "positive" && energy >= 0.5)
      return "Positive and excited - match it but keep it brief.";
    if (sentiment === "positive" && energy >= 0.01)
      return "Positive - try to keep the same energy.";

    return "";
  }

  useEffect(() => {
    if (!showAiError) return;

    if (showAiError) {
      setTimeout(() => {
        setShowAiError(false);
      }, 3000);
    }
  }, [showAiError]);

  return (
    <div className="flex w-full">
      <SideNav>
        <SidebarItem
          icon={<UserCircle size={20} />}
          text="Home"
          to="/chat"
          end
        />
        <SidebarItem
          icon={<UserCircle size={20} />}
          text="Profile"
          to="/profile"
          end
        />
        <div className="mt-11">
          {" "}
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Log Out"
            onClick={logout}
          />
        </div>
      </SideNav>
      <div className=" grid min-h-dvh  place-items-start justify-center  w-full mt-11 2xl:mt-32">
        {" "}
        {conversations.length <= 0 && (
          <>
            <main className="flex flex-col gap-28 pr-5 md:pl-3 mt-3 justify-end self-center">
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-2xl md:text-3xl">
                  Start by creating a conversation
                </span>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => createConversation()}
                  className="bg-none border border-[#BE9C3D] text-white text-xs sm:text-lg w-28 sm:w-48 sm:h-16  shadow-md hover:shadow-lg  mt-5 self-center"
                >
                  New Conversation
                </Button>
              </div>
              <div className="flex flex-col items-start">
                {" "}
                <span className="text-sm sm:text-2xl md:text-3xl">
                  {" "}
                  Do you already have an ID?
                </span>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => joinById()}
                  className="bg-none border border-[#BE9C3D] text-white text-xs sm:text-lg w-28 sm:w-40 sm:h-16  mt-5 self-center"
                >
                  Join by ID
                </Button>
              </div>
            </main>
          </>
        )}
        <main className="flex-1  p-4 w-full">
          {conversations.length > 0 && (
            <>
              {" "}
              <div className="relative inline-block">
                <span className="text-sm sm:text-lg md:text-2xl text-start absolute -top-3 left-0 md:-top-2 md:left-1 text-[#BE9C3D]">
                  {" "}
                  {peerName ? peerName : "waiting for other user..."}
                </span>
                <MessagePair
                  key={activeId}
                  theirs={lastTheirs?.text}
                  mine={lastMine?.text}
                  pinClass={pinClass || "text-green-500 "}
                  glow={glow}
                />{" "}
                <span className="text-sm sm:text-lg md:text-2xl absolute bottom-9 md:bottom-11 right-11 md:-right-1 md:left-36 text-[#BE9C3D]">
                  {user?.user}
                </span>
              </div>
              <div className="relative min-h-[100svh] pb-[calc(72px+env(safe-area-inset-bottom,0px)+12px)]  md:pb-0">
                <div className="flex-row">
                  {lastTheirs && (
                    <>
                      {sentiment !== "" && (
                        <div className=" flex justify-start items-start  my-5">
                          <div
                            className={`w-3 h-3 rounded-full  ${moodColor(
                              sentiment,
                              energy
                            )}`}
                          />
                          <MainIcon
                            className={`h-9 w-9 pb-0.5 ${moodColor(
                              sentiment,
                              energy
                            )}`}
                          />
                          <span className="text-sm opacity-80 font-thin text-center self-end">
                            {moodLabel(sentiment, energy)}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex gap-5 flex-wrap flex-col justify-start items-start">
                        {tips.map((t, i) => (
                          <Button
                            variant="subtle"
                            size="md"
                            key={i}
                            className=" bg-white p-3 text-xs md:text-lg"
                            onClick={() => setNewMessage(t)}
                          >
                            {t}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="fixed bottom-20 left-0 flex flex-col justify-start items-start sm:left-20 md:static md:mt-52">
                  {" "}
                  <StatusBar text={flashText} kind={flashKind} />
                  {showAiError && (
                    <div className="flex justify-start items-end pt-5 h-11">
                      <span>
                        {" "}
                        <MainIcon
                          className={`h-9 w-9 pb-1 text-red-600`}
                        />{" "}
                      </span>
                      <p
                        id="ai error"
                        role="alert"
                        className="text-xs md:text-lg"
                      >
                        AI found no message to analyze...
                      </p>
                    </div>
                  )}
                  {inputError && (
                    <div className=" flex justify-start items-end">
                      {" "}
                      <span>
                        {" "}
                        <MainIcon
                          className={`h-9 w-9 pb-1 text-red-600`}
                        />{" "}
                      </span>
                      <p
                        id="chat error"
                        role="alert"
                        className=" text-xs md:text-lg "
                      >
                        {inputError}
                      </p>
                    </div>
                  )}
                  <Composer
                    key={`composer-${activeId}`}
                    value={newMessage}
                    onSend={handleSubmit}
                    onChange={setNewMessage}
                    onSuggest={async () => {
                      if (!lastTheirs) {
                        setShowAiError(true);
                        return;
                      }
                      setAiLoading(true);
                      try {
                        const res = await suggestReply(lastTheirs.text, 12);
                        setTips(res.suggestions || []);
                        setEnergy(Number(res.energy ?? 0));
                        setSentiment((res.sentiment as any) || "");
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                    aiLoading={aiLoading}
                    inputError={inputError}
                    setIsFocused={setIsFocused}
                    showAiError={showAiError}
                    setShowAiError={setShowAiError}
                  />
                </div>{" "}
              </div>
            </>
          )}{" "}
        </main>
      </div>
    </div>
  );
};

export default ChatContainer;
