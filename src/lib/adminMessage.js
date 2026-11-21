import vi from "../locales/vi.json";
import { translateAuthMessage } from "./authMessage";

const messageKeys = new Map(Object.entries(vi.adminMessages).map(([key, message]) => [message, key]));
export function translateAdminMessage(message, t) {
  const key = messageKeys.get(message);
  return key ? t(`adminMessages.${key}`) : translateAuthMessage(message, t);
}
