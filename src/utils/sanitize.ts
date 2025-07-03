export const trim = (b: string) => b.trim();
export const stripTags = (b: string) => b.replace(/<[^>]+>/g, "");

export const isSafeText = (str: string) => sanitize(str).trim().length > 0;

const pipe =
  (...fns: ((arg: string) => string)[]) =>
  (x: string) =>
    fns.reduce((acc, fn) => fn(acc), x); //Currying

export const sanitize = pipe(trim, stripTags);
