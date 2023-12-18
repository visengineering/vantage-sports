export const assertContext = (context: unknown, name: string) => {
  if (context === undefined)
    throw new Error(
      `Either you or the component you used uses the use${name} hook which needs to be placed inside a ${name}Provider. Please wrap your component inside <${name}Provider></${name}Provider>.`
    );
};
