import { useChat } from "../hooks/useChat";

import SideNav from "../../../shared/components/sideNav";
import { LogOut, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useConversations } from "../../../shared/context/ConversationsContext";

import type { Message } from "../../../shared/types";
import { useMemo, useState, useEffect } from "react";

import logoUrl from "../../../assets/DriftusLogo.svg";
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
  } = useChat();

  const [tips, setTips] = useState<string[]>([]);
  const [energy, setEnergy] = useState(0);
  const [sentiment, setSentiment] = useState<
    "positive" | "neutral" | "negative" | ""
  >("");
  const [aiLoading, setAiLoading] = useState(false);

  const [showAiError, setShowAiError] = useState(false);
  const [glow, setGlow] = useState(false);

  const { conversations, activeId } = useConversations();

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

  return (
    <div className="flex w-full">
      <SideNav>
        <SidebarItem
          icon={<UserCircle size={20} />}
          text="Profile"
          to="/profile"
          end
        />{" "}
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Log Out"
          onClick={logout}
        />
      </SideNav>
      <div className=" grid min-h-dvh place-items-center justify-center w-full">
        {" "}
        {conversations.length <= 0 && (
          <>
            <img
              src={logoUrl}
              alt="DriftUs - Feel the message."
              className=" w-[min(90vw,720px)] h-fit  self-start"
            />
          </>
        )}
        <main className="flex-1 p-4 w-full">
          {conversations.length > 0 && (
            <>
              {" "}
              <div className="relative inline-block">
                <span className="text-2xl text-start absolute -top-2 left-1 text-[#BE9C3D]">
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
                <span className="text-2xl absolute bottom-11 -right-1 left-36 text-[#BE9C3D]">
                  {user?.user}
                </span>
              </div>
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
              />
            </>
          )}{" "}
          <div className="flex-row">
            {lastTheirs && (
              <>
                {sentiment !== "" && (
                  <div className=" flex justify-center items-start  mb-5">
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
                    <span className="text-sm opacity-80 font-thin text-center">
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
                      className=" bg-white p-3"
                      onClick={() => setNewMessage(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center items-end pr-24 pt-5 h-11">
            {showAiError && (
              <>
                <span>
                  {" "}
                  <MainIcon className={`h-9 w-9 pb-1 text-red-600`} />{" "}
                </span>
                <p id="ai error" role="alert">
                  AI Suggestions is currently not available.
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatContainer;
