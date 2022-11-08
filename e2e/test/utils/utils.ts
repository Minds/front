const { I } = inject();

export const generateARandomString = (): string =>
  Math.random()
    .toString(36)
    .substr(2, 10);
