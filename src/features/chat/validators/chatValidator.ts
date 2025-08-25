import type { ValidatorRule } from "../../../shared/types/ValidatorRule";

export const ValidatorRules: ValidatorRule[] = [
  {
    fn: (input) => input.trim().length > 0,
    error: "Empty message not allowed",
  },
  {
    fn: (input) => input.length < 30,
    error: "Max 30 characters per message",
  },
  {
    fn: (input) => !/<[^>]+>/.test(input),
    error: "<> symbols are not allowed",
  },
];

export const ValidateWithErrors = (input: string): string[] => {
  return ValidatorRules.filter((rule) => !rule.fn(input)).map(
    (rule) => rule.error
  );
};
