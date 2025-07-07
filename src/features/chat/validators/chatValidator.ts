// const notEmpty = (str: string) => str.trim().length > 0; //trim to remove white spaces when counting?
// const maxLength = (max: number) => (str: string) => str.length < max; //why not trim()
// const noHtmlTags = (str: string) => !/<[^>]+>/.test(str);
// const pipeValidator =
//   (...fns: Validator[]) =>
//   (input: string): boolean =>
//     fns.every((fn) => fn(input));

// export const validator = pipeValidator(notEmpty, maxLength(3), noHtmlTags);

export type ValidatorRule = {
  fn: (input: string) => boolean;
  error: string;
};

export const ValidatorRules: ValidatorRule[] = [
  {
    fn: (input) => input.trim().length > 0,
    error: "Empty message not allowed",
  },
  { fn: (input) => input.length < 30, error: "Max 30 characters per message" },
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
