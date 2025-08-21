import InputField from "../../../shared/components/InputField";

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
import ChatBubble from "../components/ChatBubble";

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
    fetchMessages,
  } = useChat();

  const [tips, setTips] = useState<string[]>([]);
  const [energy, setEnergy] = useState(0);
  const [sentiment, setSentiment] = useState<
    "positive" | "neutral" | "negative" | ""
  >("");
  const [aiLoading, setAiLoading] = useState(false);

  const [showAiError, setShowAiError] = useState(false);

  const { conversations } = useConversations();

  const { logout, user } = useAuth();

  const myId = String(user?.id ?? "");

  const pinClass = moodColor(sentiment, energy);

  async function suggestReply(source: string, maxWords = 12) {
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
      <div className="pl-56 grid min-h-dvh place-items-center">
        <main className="flex-1 overflow-y-auto p-4 ml-11 ">
          {peerName && (
            <div className="mb-4 flex">Conversation with: {peerName}</div>
          )}
          <ul className="flex flex-col gap-11 ">
            <li>
              <ChatBubble
                text={lastTheirs?.text}
                side="left"
                showPin={true}
                pinClassName={pinClass || "text-green-500"}
              />
            </li>

            <li className="mt-11">
              <ChatBubble text={lastMine?.text} side="right" />
            </li>
          </ul>
          {/* <ChatList messages={messages} removeMessage={removeMessage} /> */}
          {conversations.length > 0 && (
            <>
              <form onSubmit={handleSubmit} className="flex justify-center">
                <InputField
                  name="chat"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Try writing something"
                />
                <button type="submit">Send</button>
                <span></span>
              </form>

              <button onClick={fetchMessages}>Load Message</button>
            </>
          )}{" "}
          <div className="flex-row">
            <StatusBar text={flashText} kind={flashKind} />

            {lastTheirs && (
              <>
                {" "}
                <button
                  type="button"
                  disabled={!lastTheirs || aiLoading}
                  onClick={async () => {
                    if (!lastTheirs) return;
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
                >
                  {aiLoading ? "Analyzing message..." : "AI Suggestions"}
                </button>
                {sentiment !== "" && (
                  <>
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
                  </>
                )}
                <div className="mt-2 flex gap-2 flex-wrap">
                  {tips.map((t, i) => (
                    <button
                      key={i}
                      type="button"
                      className="underline"
                      onClick={() => setNewMessage(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {showAiError && (
            <span>AI Suggestions is currently not available.</span>
          )}
        </main>
      </div>
    </>
  );
};

export default ChatContainer;
