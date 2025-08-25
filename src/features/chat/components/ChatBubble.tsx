import { Pin } from "./Pin";

type Props = {
  text: string | undefined;
  side?: "left" | "right";
  pinClassName?: string;
  showPin?: boolean;
  glow?: boolean;
};

export default function ChatBubble({
  text,
  side = "left",
  pinClassName,
  glow,
}: Props) {
  const isRight = side === "right";

  return (
    <div
      className={`relative mb-11 flex justify-center ${
        isRight ? "ml-auto text-zinc-900 mr-11" : "mr-auto"
      }  w-[300px] md:w-[320px] aspect-[309/200] `}
    >
      <div className="relative z-20 px-11 py-10 md:px-12 md:py-9  w-[300px] md:w-[320px] aspect-[309/148] flex justify-center items-center ">
        <p
          className={`text-2xl font-semibold md:text-3xl leading-relaxed text-zinc-900 whitespace-pre-wrap break-words text-center  ${
            isRight && "text-zinc-400"
          }`}
        >
          {text}
        </p>
      </div>
      {!isRight ? (
        <>
          {" "}
          <svg
            viewBox="0 0 309 148"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full 
                   [filter:drop-shadow(0_4px_8px_rgba(0,0,0,0.25))] z-10"
            aria-hidden="true"
          >
            <path
              d="M4.50531 131.75C4.34416 136.287 7.97886 140 12.5189 140H297C301.418 140 305 136.418 305 132V8.21713C305 3.71727 301.222 0.104813 296.723 0.217682C101.847 5.10707 -1.20101 1.06041 4.20215 0.00604248C8.87562 -0.90593 5.57658 101.588 4.50531 131.75Z"
              fill="#D7D7D7"
            />
          </svg>{" "}
          <div className="absolute left-5 -bottom-1 ">
            <Pin className={pinClassName} glow={glow} />
          </div>
        </>
      ) : (
        <svg
          viewBox="0 0 309 148"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full 
                   [filter:drop-shadow(0_4px_8px_rgba(0,0,0,0.25))]"
          aria-hidden="true"
          fill="#D7D7D7"
        >
          <path d="M304.495 8.24993C304.656 3.71273 301.021 0 296.481 0H12C7.58173 0 4 3.58172 4 8V131.783C4 136.283 7.77841 139.895 12.2769 139.782C207.153 134.893 310.201 138.94 304.798 139.994C300.124 140.906 303.423 38.4121 304.495 8.24993Z" />
        </svg>
      )}{" "}
    </div>
  );
}
