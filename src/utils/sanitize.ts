const trim = (b: string) => b.trim();
const stripTags = (b: string) => b.replace(/<[^>]+>/g, "");

const pipe =
  (...fns: ((arg: string) => string)[]) =>
  (x: string) =>
    fns.reduce((acc, fn) => fn(acc), x);

export const sanitize = pipe(trim, stripTags);
