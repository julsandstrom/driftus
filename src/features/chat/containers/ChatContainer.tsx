import { useChat } from "../hooks/useChat";

import SideNav from "../../../shared/components/sideNav";
import { BarChart3, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useConversations } from "../../../shared/context/ConversationsContext";
import { StatusBar } from "../components/StatusBar";

import type { Message } from "../../../shared/types";
import { useMemo } from "react";
import { useState } from "react";

import logoUrl from "../../../assets/DriftusLogo.svg";
import { Button } from "../../../shared/components/Button";
import MessagePair from "../components/MessagePair";
import Composer from "../components/Composer";

const ChatContainer = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    // removeMessage,
    peerName,
    flashKind,
    flashText,

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

  const { conversations } = useConversations();

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
    setTips([]);
    setSentiment("");
    setEnergy(0);
    moodColor("", 0);
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
    <>
      <div className="flex h-screen fixed left-0 top-0 ml-[width]">
        <SideNav>
          <SidebarItem
            icon={<BarChart3 size={20} />}
            text="Profile"
            to="/profile"
            end
          />{" "}
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Log Out"
            onClick={logout}
          />
        </SideNav>
      </div>
      {conversations.length <= 0 && (
        <>
          <img
            src={logoUrl}
            alt="DriftUs — Feel the message."
            className="block mx-auto w-[min(90vw,720px)]"
          />
        </>
      )}
      <div className=" grid min-h-dvh place-items-center justify-center w-full">
        <main className="flex-1 p-4 w-full">
          {peerName && (
            <div className="mb-4 flex">Conversation with: {peerName}</div>
          )}
          {conversations.length > 0 && (
            <>
              <MessagePair
                theirs={lastTheirs?.text}
                mine={lastMine?.text}
                pinClass={pinClass || "text-green-500 "}
                glow={glow}
              />

              {/* <ChatList messages={messages} removeMessage={removeMessage} /> */}

              <Composer
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
                    const out = await suggestReply(lastTheirs.text, 12);
                    setTips(out.suggestions || []);
                    setEnergy(Number(out.energy ?? 0));
                    setSentiment((out.sentiment as any) || "");
                  } finally {
                    setAiLoading(false);
                  }
                }}
                aiLoading={aiLoading}
                inputError={inputError}
                setIsFocused={setIsFocused}
              />
              {/* <span className="text-red-600 mr-48">{inputError}</span> */}
            </>
          )}{" "}
          <div className="flex-row">
            <StatusBar text={flashText} kind={flashKind} />

            {lastTheirs && (
              <>
                {sentiment !== "" && (
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${moodColor(
                        sentiment,
                        energy
                      )}`}
                    />

                    <span className="text-sm opacity-80">
                      {moodLabel(sentiment, energy)}
                    </span>
                  </div>
                )}
                <div className="mt-2 flex gap-2 flex-wrap flex-col justify-start items-start">
                  {tips.map((t, i) => (
                    <Button
                      variant="ghost"
                      size="md"
                      key={i}
                      className="underline"
                      onClick={() => setNewMessage(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
          {showAiError && (
            <p id="ai error" role="alert">
              AI Suggestions is currently not available.
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default ChatContainer;
