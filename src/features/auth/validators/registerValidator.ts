import type { ValidatorRule } from "../../../shared/types/ValidatorRule";
import { sanitize } from "../../../shared/utils/sanitize";

export type RegisterField = "username" | "password" | "email" | "avatar";

export const RegisterFieldRules = {
  username: [
    {
      fn: (n) => n.length > 0,
      error: "Field can't be empty",
    },
    { fn: (n) => n.length <= 15, error: "Max 15 characters for name" },
  ],
  email: [
    { fn: (e) => e.length > 0, error: "Email field can't be empty" },
    { fn: (e) => e.length <= 20, error: "Max 20 characters for email" },
    {
      fn: (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
      error: "Invalid email format",
    },
  ],
  password: [
    {
      fn: (p) => p.length >= 6,
      error: "Password has to be at least 6 characters",
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
