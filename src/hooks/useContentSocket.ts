import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useContentSocket(
  contentId: string,
  onReceive: (data: any) => void
) {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });
 
    socket.emit("join", { contentId });

    socket.on("update", onReceive);

    socketRef.current = socket;

    return () => {
      socket.emit("leave", { contentId });
      socket.disconnect();
    };
  }, [contentId, onReceive]);

  const sendChange = (payload: any) => {
    socketRef.current?.emit("edit", { contentId, ...payload });
  };

  return { sendChange };
}
