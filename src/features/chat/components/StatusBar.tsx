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
      className={` flex justify-center items-end rounded-xl shadow ${cls}p-2 text-center pr-56 `}
    >
      <span>
        {" "}
        <MainIcon className={`h-9 w-9 pb-1 ${cls}`} />
      </span>
      <p> {text}</p>
    </div>
  );
}
