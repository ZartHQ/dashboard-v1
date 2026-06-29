import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/config";

export function useAdminSSE() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  useEffect(() => {
    let active = true;
    let controller = new AbortController();

    async function connect() {
      if (!active) return;
      setStatus("connecting");

      const token = typeof window !== "undefined" ? sessionStorage.getItem("zart_access_token") : null;
      if (!token) {
        setStatus("disconnected");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/admin/sse`, {
          signal: controller.signal,
          headers: {
            "Accept": "text/event-stream",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`SSE HTTP error: ${response.status}`);
        }

        setStatus("connected");

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body reader available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (active) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              const dataStr = trimmed.slice(5).trim();
              console.log(dataStr);
              try {
                const eventData = JSON.parse(dataStr);

                // Invalidate query to fetch updated requests
                queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });

                // Optional: Invalidate patrons/artisans if the event suggests updates
                if (eventData.type?.includes("artisan")) {
                  queryClient.invalidateQueries({ queryKey: ["admin", "artisans"] });
                }
              } catch (err) {
                // If it's not JSON, it could be a simple string message
                console.log("[SSE Message (raw)]:", dataStr);
                queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
              }
            }
          }
        }
      } catch (error: any) {
        if (active && error.name !== "AbortError") {
          console.error("SSE Connection error, reconnecting in 5s...", error);
          setStatus("disconnected");
          setTimeout(() => {
            if (active) {
              controller = new AbortController();
              connect();
            }
          }, 5000);
        }
      }
    }

    connect();

    return () => {
      active = false;
      controller.abort();
    };
  }, [queryClient]);

  return { status };
}
