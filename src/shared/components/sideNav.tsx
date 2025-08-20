import { ChevronFirst, ChevronLast } from "lucide-react";
import { useContext, useState } from "react";
import { createContext } from "react";
import { NavLink } from "react-router-dom";
import { useConversations } from "../context/ConversationsContext";
import ConversationItem from "./ConversationItem";
import UserContainer from "../../features/user/containers/UserContainer";

type SidebarContext = {
  expanded: boolean;
  toggle: () => void;
  activeKey: string | null;
  setActiveKey: (id: string) => void;
};
const SidebarContext = createContext<SidebarContext | null>(null);

export default function SideNav({ children }: { children: React.ReactNode }) {
  const {
    conversations,
    activeId,
    setActiveId,
    createConversation,
    deleteConversation,
    ensureConversation,
  } = useConversations();
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const joinById = () => {
    const id = prompt("Klistra in conversationId (GUID):")?.trim();
    if (!id) return;

    if (!(id.length === 36 && id.split("-").length === 5))
      return alert("Ogiltigt ID");

    ensureConversation(id, "Shared Conversation");
  };

  return (
    <>
      {expanded ? (
        <aside
          className={`
        h-screen shrink-0 border-r
        transition-[width] duration-200 
        ${expanded ? "w-64" : "w-16"}
        sticky top-0 left-0
      `}
        >
          <nav className="h-full flex flex-col">
            <button
              onClick={() => createConversation()}
              className="w-full text-left"
            >
              ➕ New Conversation
            </button>
            <button onClick={() => joinById()} className="w-full text-left">
              Join By ID
            </button>
            {conversations.map((c) => (
              <ConversationItem
                key={c.id}
                conv={c}
                isActive={activeId === c.id}
                setActiveId={setActiveId}
                onDelete={deleteConversation}
                expanded={expanded}
                isShared={!!c.shared}
              />
            ))}
            <div className="p-4 pb-2 flex justify-between items-center">
              <img
                src="https://i.pravatar.cc/200"
                className={`overflow-hidden transition-all ${
                  expanded ? "w-32" : "w-0"
                }`}
                alt=""
              />{" "}
              <button
                onClick={() => setExpanded((c) => !c)}
                className="p-1.5 rounded-lg hover:bg-gray-600"
              >
                {expanded ? <ChevronFirst /> : <ChevronLast />}
              </button>
            </div>
            <span>
              {" "}
              <UserContainer />
            </span>

            <SidebarContext.Provider
              value={{
                expanded,
                toggle: () => setExpanded((c) => !c),
                activeKey,
                setActiveKey,
              }}
            >
              <ul className="flex-1 px-3">{children}</ul>
            </SidebarContext.Provider>
          </nav>
        </aside>
      ) : (
        <button
          onClick={() => setExpanded((c) => !c)}
          className="p-1.5 rounded-lg hover:bg-gray-600"
        >
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      )}
    </>
  );
}

export function SidebarItem({
  icon,
  text,
  to,
  onClick,
  alert,
  end,
}: {
  icon: React.ReactNode;
  text: string;
  to?: string;
  onClick?: () => void;

  alert?: boolean;
  end?: boolean;
}) {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("SidebarItem must be used within <SideNav />");
  const { expanded } = ctx;

  const base = `relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group`;
  const active =
    "bg-gradient-to-tr from-green-200 to-green-400 text-indigo-800";
  const inactive = "hover:bg-indigo-50 text-gray-100";

  const inner = (
    <>
      {icon}{" "}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>{" "}
      {alert && (
        <div
          className={`absolute right-2 top-2 w-2 h-2 rounded bg-indigo-400`}
        />
      )}
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100
            text-indigo-800 text-sm invisible opacity-0 -translate-x-3
            transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <li>
        <NavLink
          to={to}
          end={end}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}  w-full text-left`
          }
        >
          {inner}
        </NavLink>
      </li>
    );
  }

  return (
    <li onClick={onClick} className={`${base} ${inactive} w-full text-left`}>
      {inner}
    </li>
  );
}
