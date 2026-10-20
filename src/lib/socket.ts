import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./config";

// The chat gateway lives at <host>/chat (Socket.IO default path /socket.io/).
// API_BASE_URL is like https://api.zarthq.com/v1 -> strip the /v1 to get the host.
const SOCKET_HOST = API_BASE_URL.replace(/\/v1\/?$/, "");

let socket: Socket | null = null;

/**
 * Returns a shared Socket.IO connection to the chat namespace, authenticated
 * with the admin's access token. One socket is reused across all threads;
 * each thread joins/leaves its own room. Returns null on the server or when
 * there is no token yet.
 */
export function getChatSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  const token = sessionStorage.getItem("zart_access_token");
  if (!token) return null;

  if (socket) return socket;

  socket = io(`${SOCKET_HOST}/chat`, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  // Keep the token fresh across reconnects (it may have been refreshed).
  socket.on("reconnect_attempt", () => {
    const fresh = sessionStorage.getItem("zart_access_token");
    if (fresh && socket) socket.auth = { token: fresh };
  });

  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
