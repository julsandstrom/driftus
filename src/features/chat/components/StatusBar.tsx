import type { FlashKind } from "../context/ChatContext";
import MainIcon from "../../../shared/components/MainIcon";
export function StatusBar({
  text,
  kind,
}: {
  text: string | null;
  kind: FlashKind;
}) {
  if (!text) return null;
  const cls =
    kind === "success"
      ? "text-green-600 "
      : kind === "error"
      ? " text-rose-800 "
      : "text-slate-800 ";
  return (
    <div
      className={`text-xs md:text-xl flex justify-start pb-11 md:pb-0 md:justify-center items-end ${cls}p-2 text-center `}
    >
      <span>
        {" "}
        <MainIcon className={`h-9 w-9 pb-1 ${cls}`} />
      </span>
      <p> {text}</p>
    </div>
  );
}
