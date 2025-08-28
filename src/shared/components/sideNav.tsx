import { SquareChevronLeft, ChevronLast } from "lucide-react";
import { useContext, useState } from "react";
import { createContext } from "react";
import { NavLink } from "react-router-dom";
import { useConversations } from "../context/ConversationsContext";
import ConversationItem from "./ConversationItem";
import UserContainer from "../../features/user/containers/UserContainer";
import { Button } from "./Button";
import { useAvatarPreview } from "../context/AvatarPreviewContext";
import { useAuth } from "../hooks/useAuth";
import logo from "../../assets/upperLogo.svg";
import { useNavigate } from "react-router-dom";
type SidebarContext = {
  expanded: boolean;
  toggle: () => void;
  activeKey: string | null;
  setActiveKey: (id: string) => void;
};
const SidebarContext = createContext<SidebarContext | null>(null);

export default function SideNav({ children }: { children: React.ReactNode }) {
  const { conversations, createConversation, deleteConversation, joinById } =
    useConversations();
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preview } = useAvatarPreview();

  const avatarSrc = preview ?? user?.avatar ?? "https://i.pravatar.cc/200";

  return (
    <>
      {expanded ? (
        <aside
          className={`
        h-full shrink-0 
        transition-[width] duration-200 pr-4 bg-[#1a1a1a]
        ${expanded ? "w-64 " : "w-16"}
        sticky top-0 left-0 h-11
      `}
        >
          <nav className="h-full flex flex-col pl-3">
            <main className="flex flex-col pl-3 mt-3">
              {" "}
              <img
                src={logo}
                alt="DriftUs — Feel the message."
                className=" w-[150px] mb-5"
              />
              <Button
                variant="default"
                size="lg"
                onClick={() => createConversation()}
                className="bg-none border border-[#BE9C3D] text-white w-40 mt-2 h-12  shadow-md hover:shadow-lg  "
              >
                New Conversation
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={() => joinById()}
                className="bg-none border border-[#BE9C3D] text-white w-40 mt-5 mb-11 h-12  "
              >
                Join by ID
              </Button>
            </main>
            <div className="p-4 pb-2 flex justify-between items-center ">
              <img
                src={avatarSrc}
                className={`overflow-hidden transition-all rounded-xl ${
                  expanded ? "w-42" : "w-0"
                }`}
                alt={user?.user ? `${user.user} avatar` : "Avatar"}
                loading="lazy"
              />{" "}
              {/* <button
                onClick={() => setExpanded((c) => !c)}
                className="p-1.5  rounded-lg hover:bg-red-600"
              >
                {expanded ? <SquareChevronLeft /> : <ChevronLast />}
              </button> */}
            </div>{" "}
            <UserContainer />
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
            <div className="h-full mt-11">
              {" "}
              {conversations.map((c) => (
                <ConversationItem
                  key={c.id}
                  conv={c}
                  onDelete={deleteConversation}
                  expanded={expanded}
                />
              ))}
            </div>
          </nav>{" "}
        </aside>
      ) : (
        <button
          onClick={() => setExpanded((c) => !c)}
          className="p-1.5 rounded-lg border-r-2 border-zinc-600 hover:bg-[#d4b34a]"
        >
          {expanded ? <SquareChevronLeft /> : <ChevronLast />}
        </button>
      )}{" "}
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

  const base = `text-xl h-11 relative flex items-center py-2  my-1 font-medium rounded-md cursor-pointer transition-colors group`;
  const active = "bg-[#BE9C3D]  text-zinc-700 text-xl";
  const inactive =
    "transition ease-out duration-200 hover:bg-[#d4b34a] hover:text-black text-xl";

  const inner = (
    <>
      <Button variant="default" size="lg" className="text-2xl">
        <span aria-hidden="true" className="w-8 h-8 pt-1">
          {" "}
          {icon}
        </span>{" "}
        {text}
      </Button>
      {alert && (
        <div
          className={`absolute right-2 top-2 w-2 h-2 rounded hover:bg-[#d4b34a]`}
        />
      )}{" "}
    </>
  );
  {
  }

  if (to) {
    return (
      <li>
        <NavLink
          to={to}
          end={end}
          onClick={onClick}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}  w-full text-left text-xl`
          }
        >
          {inner}
        </NavLink>
      </li>
    );
  }

  return (
    <li
      onClick={onClick}
      className={`${base} ${inactive} w-full text-left text-xl`}
    >
      <Button variant="default" size="lg" className="">
        <span aria-hidden="true" className="w-8 h-8 pt-1">
          {" "}
          {icon}
        </span>{" "}
        {text}
      </Button>
    </li>
  );
}
