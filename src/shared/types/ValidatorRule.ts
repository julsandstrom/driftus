export type ValidatorRule = {
  fn: (input: string) => boolean;
  error: string;
};
