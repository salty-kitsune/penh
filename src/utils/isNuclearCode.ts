export const CURRENT_CONSTRAINT = 7;
export const NUCLEAR_HOST = "https://nhentai.net";

export default function isNuclearCode(value: string) {
  return !!(value.match(/^\d+$/) && value.length < CURRENT_CONSTRAINT);
}
