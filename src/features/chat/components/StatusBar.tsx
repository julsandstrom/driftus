import type { FlashKind } from "../context/ChatContext";

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
      ? "bg-green-100 text-green-800 border-green-300"
      : kind === "error"
      ? "bg-rose-100 text-rose-800 border-rose-300"
      : "bg-slate-100 text-slate-800 border-slate-300";
  return (
    <div
      className={`fixed bottom-50 z-50 p-24 py-2 rounded-xl border shadow ${cls}`}
    >
      {text}
    </div>
  );
}
