const BASE = "https://chatify-api.up.railway.app";

type ApiMessage = {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  conversationId: string;
};

type CreateMessageRes = {
  message: string;
  latestMessage: ApiMessage;
};

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function ensureCsrf() {
  await fetch(`${BASE}/csrf`, { method: "PATCH", credentials: "include" });
}

export async function getMessages(conversationId: string) {
  const res = await fetch(
    `${BASE}/messages?conversationId=${encodeURIComponent(conversationId)}`,
    {
      headers: { ...authHeader() },
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to find messages");
  return res.json();
}

export async function createMessage(text: string, conversationId: string) {
  await ensureCsrf();
  const res = await fetch(`${BASE}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    credentials: "include",
    body: JSON.stringify({ text, conversationId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send message");
  }

  const data: CreateMessageRes = await res.json();
  return data.latestMessage;
}

export async function deleteMessage(id: number | string) {
  await ensureCsrf();
  const res = await fetch(`${BASE}/messages/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Message could not be deleted.");
}
