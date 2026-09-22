import { Message } from "./types";

/**
 * TEMPORARY local message store, backed by localStorage.
 *
 * This exists only so the messaging UI works before the backend
 * endpoints are ready. Once they are, flip USE_STUB to false in
 * ./api.ts and this file can be deleted.
 */
const KEY = "zart_messages_stub";

type Store = Record<string, Message[]>;

function readAll(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(data: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private window etc.) — fail quietly
  }
}

export const messagingStub = {
  getThread(requestId: number): Message[] {
    return readAll()[requestId] || [];
  },

  append(message: Message): Message {
    const all = readAll();
    const list = all[message.requestId] || [];
    list.push(message);
    all[message.requestId] = list;
    writeAll(all);
    return message;
  },

  markRead(requestId: number) {
    const all = readAll();
    all[requestId] = (all[requestId] || []).map((m) => ({ ...m, read: true }));
    writeAll(all);
  },
};
