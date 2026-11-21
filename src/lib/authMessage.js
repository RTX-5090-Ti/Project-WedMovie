import vi from "../locales/vi.json";

// Translate at the UI boundary while existing services keep their error messages.
// Rendering with t() also updates an already-visible message when language changes.
const messageKeys = new Map(Object.entries(vi.authMessages).map(([key, message]) => [message, key]));
export function translateAuthMessage(message, t) {
  if (!message) return "";
  const key = messageKeys.get(message);
  if (key) return t(`authMessages.${key}`);
  const status = message.match(/\(HTTP (\d{3})\)/)?.[1];
  return status ? t("authMessages.http", { status }) : t("authMessages.unknown");
}
