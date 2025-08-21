type Props = {
  text: string | undefined;
  side?: "left" | "right";
};

export default function ChatBubble({ text, side = "left" }: Props) {
  const isRight = side === "right";

  return (
    <div
      className={`relative max-w-[900px] ${isRight ? "ml-auto" : "mr-auto"}`}
    >
      <div className="relative z-10 px-8 py-10 md:px-12 md:py-12">
        <p className="text-2xl md:text-3xl leading-relaxed text-zinc-900 whitespace-pre-wrap break-words">
          {text}
        </p>
      </div>

      <svg
        viewBox="0 0 309 148"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full -z-10
                   [filter:drop-shadow(0_4px_8px_rgba(0,0,0,0.25))]"
        aria-hidden="true"
      >
        <path
          d="M4.50531 131.75C4.34416 136.287 7.97886 140 12.5189 140H297C301.418 140 305 136.418 305 132V8.21713C305 3.71727 301.222 0.104813 296.723 0.217682C101.847 5.10707 -1.20101 1.06041 4.20215 0.00604248C8.87562 -0.90593 5.57658 101.588 4.50531 131.75Z"
          fill="#D7D7D7"
        />
      </svg>
    </div>
  );
}
