import React, { createContext, useContext, useState } from "react";

type Ctx = { preview: string | null; setPreview: (v: string | null) => void };
const AvatarPreviewContext = createContext<Ctx | null>(null);

export function AvatarPreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <AvatarPreviewContext.Provider value={{ preview, setPreview }}>
      {children}
    </AvatarPreviewContext.Provider>
  );
}

export function useAvatarPreview() {
  const ctx = useContext(AvatarPreviewContext);
  if (!ctx)
    throw new Error(
      "useAvatarPreview must be used within AvatarPreviewProvider"
    );
  return ctx;
}
