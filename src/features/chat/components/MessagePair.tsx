import ChatBubble from "./ChatBubble";

type Props = {
  theirs?: string;
  mine?: string;
  pinClass: string;
  glow: boolean;
};

export default function MessagePair({ theirs, mine, pinClass, glow }: Props) {
  return (
    <ul className="flex flex-col gap-14 justify-center items-start">
      <li className="">
        <ChatBubble
          text={theirs}
          side="left"
          showPin={true}
          pinClassName={pinClass || "text-green-500 "}
          glow={glow}
        />
      </li>

      <li className="">
        <ChatBubble text={mine} side="right" />
      </li>
    </ul>
  );
}
