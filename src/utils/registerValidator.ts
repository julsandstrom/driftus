import type { ValidatorRule } from "./chatValidator";

export type RegisterField = "username" | "password" | "email" | "avatar";

type FieldValidator = Record<RegisterField, ValidatorRule[]>;

export const RegisterFieldRules: FieldValidator = {
  username: [
    { fn: (n) => n.length > 0, error: "Field can't be empty" },
    { fn: (n) => n.length < 15, error: "Max 15 characters for name" },
  ],
  email: [
    { fn: (e) => e.length > 0, error: "Email field can't be empty" },
    { fn: (e) => e.length < 15, error: "Max 20 characters for email" },
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
};

export const ValidateField = (
  field: RegisterField,
  value: string
): string[] => {
  const rules = RegisterFieldRules[field];
  return rules.filter((f) => !f.fn(value)).map((r) => r.error);
};
