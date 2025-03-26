import React, { useEffect, useRef } from "react";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const BodegaHerramientaNotifications: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const processedMessages = useRef<Set<string>>(new Set());
  const isConnectedRef = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const SOCKET_URL = "ws://127.0.0.1:8000/ws/inventario/bodega_herramienta/";

  const connectWebSocket = () => {
    if (isConnectedRef.current || socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    const wsUrl = `${SOCKET_URL}?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      isConnectedRef.current = true;
      reconnectAttempts.current = 0;
      socket.send(JSON.stringify({ action: "sync" }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const messageId = data.message_id || data.id?.toString() || `${data.accion || data.action}-${Date.now()}`;
      if (processedMessages.current.has(messageId)) {
        return;
      }
      processedMessages.current.add(messageId);

      const now = Date.now();
      let lastRefetch = localStorage.getItem("lastRefetchHerramienta")
        ? parseInt(localStorage.getItem("lastRefetchHerramienta")!, 10)
        : 0;
      if (now - lastRefetch > 2000) {
        queryClient.invalidateQueries({ queryKey: ["bodega_herramientas"] });
        localStorage.setItem("lastRefetchHerramienta", now.toString());
      }

      if (data.action === "initial_state" && data.data) {
        const statusMessage = data.data
          .map((item: any) => `${item.bodega || "Desconocido"} - ${item.herramienta || "Desconocido"}: ${item.cantidad || 0} unidades`)
          .join(", ");
        addToast({
          title: "Estado de Bodega Herramienta",
          description: statusMessage,
          timeout: 5000,
        });
      } else if (data.accion === "create" || data.accion === "update") {
        const message = `${data.bodega || "Desconocido"} - ${data.herramienta || "Desconocido"}: ${data.cantidad || 0} unidades`;
        addToast({
          title: data.accion === "create" ? "Herramienta Creada" : "Herramienta Actualizada",
          description: message,
          timeout: 5000,
        });
      } else if (data.accion === "delete") {
        const message = `Registro ID ${data.id || "Desconocido"} eliminado`;
        addToast({
          title: "Herramienta Eliminada",
          description: message,
          timeout: 5000,
        });
      }
    };

    socket.onerror = () => {
      isConnectedRef.current = false;
      socketRef.current = null;
    };

    socket.onclose = () => {
      isConnectedRef.current = false;
      socketRef.current = null;
      processedMessages.current.clear();
      if (isAuthenticated) {
        reconnectAttempts.current += 1;
        setTimeout(() => connectWebSocket(), 5000);
      }
    };
  };

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        isConnectedRef.current = false;
        processedMessages.current.clear();
      }
      return;
    }

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        isConnectedRef.current = false;
        processedMessages.current.clear();
      }
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
};

export default BodegaHerramientaNotifications;