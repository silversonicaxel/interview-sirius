/**
 * Check if a text ends with some of provided strings
 *
 * @param text text to be checked
 * @param ends array of provided strings
 * @returns boolean
 */
export const endsWithSome = (text: string, ends: string[]): boolean => {
  return ends.some(end => text.endsWith(end));
}
