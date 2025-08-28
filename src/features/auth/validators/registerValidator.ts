import type { ValidatorRule } from "../../../shared/types/ValidatorRule";
import { sanitize } from "../../../shared/utils/sanitize";

export type RegisterField = "username" | "password" | "email" | "avatar";

export const RegisterFieldRules = {
  username: [
    {
      fn: (n) => n.length > 0,
      error: "Username is empty",
    },
    { fn: (n) => n.length <= 11, error: "Max 11 characters" },
  ],
  email: [
    { fn: (e) => e.length > 0, error: "Email is empty" },
    { fn: (e) => e.length <= 30, error: "Max 30 characters" },
    {
      fn: (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
      error: "Invalid email format",
    },
  ],
  password: [
    {
      fn: (p) => p.length >= 6,
      error: "Minimum 6 characters",
    },
    {
      fn: (p) => p.length <= 15,
      error: "Max 15 characters",
    },
  ],
  avatar: [],
} satisfies { [K in RegisterField]: ValidatorRule[] };

export const ValidateField = (
  field: RegisterField,
  value: string
): string[] => {
  const textInput = sanitize(value);
  return RegisterFieldRules[field]
    .filter((r) => !r.fn(textInput))
    .map((r) => r.error);
};
