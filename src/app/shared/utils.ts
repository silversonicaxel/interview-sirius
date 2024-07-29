export const endsWithSome = (text: string, ends: string[]) => {
  return ends.some(end => text.endsWith(end));
}
