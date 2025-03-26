import React, { useEffect, useState, useRef } from "react";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

interface Notification {
  message: string;
}

const BodegaInsumoNotifications: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const processedMessages = useRef<Set<string>>(new Set());
  const isConnectedRef = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const SOCKET_URL = "ws://127.0.0.1:8000/ws/inventario/bodega_insumo/";

  const connectWebSocket = () => {
    if (isConnectedRef.current || socketRef.current) {
      console.log("⚠️ Ya existe una conexión activa, ignorando nueva conexión");
      return;
    }

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error("❌ Se alcanzó el máximo de intentos de reconexión. Deteniendo...");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("⛔ No hay token disponible");
      return;
    }

    const wsUrl = `${SOCKET_URL}?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Conectado al WebSocket:", wsUrl, "Instancia:", socketRef.current);
      isConnectedRef.current = true;
      reconnectAttempts.current = 0;
      socket.send(JSON.stringify({ action: "sync" }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Nuevo mensaje recibido - Instancia:", socketRef.current, "Datos:", data);

      // Usar message_id como identificador único, si está disponible
      const messageId = data.message_id || (data.id ? `${data.accion || data.action}-${data.id}` : `${data.accion || data.action}-${Date.now()}`);
      if (processedMessages.current.has(messageId)) {
        console.log("⚠️ Mensaje duplicado ignorado (ID:", messageId, "):", data);
        return;
      }
      processedMessages.current.add(messageId);
      console.log("✅ Mensaje procesado (ID:", messageId, ")");

      // Refetch solo si han pasado al menos 2 segundos desde el último refetch
      const now = Date.now();
      let lastRefetch = localStorage.getItem("lastRefetch") ? parseInt(localStorage.getItem("lastRefetch")!, 10) : 0;
      if (now - lastRefetch > 2000) {
        queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
        localStorage.setItem("lastRefetch", now.toString());
        console.log("🔄 Refetch disparado");
      } else {
        console.log("⏳ Refetch ignorado (demasiado reciente)");
      }

      if (data.action === "initial_state" && data.bodega_status) {
        const statusMessage = data.bodega_status
          .map((item: any) => `${item.bodega || "Desconocido"} - ${item.insumo || "Desconocido"}: ${item.cantidad || 0} unidades`)
          .join(", ");
        setNotifications((prev) => [
          ...prev.filter((n) => !n.message.includes("Estado inicial")),
          { message: `Estado inicial de la bodega: ${statusMessage}` },
        ].slice(-1));
        addToast({
          title: "Estado de Bodega",
          description: statusMessage,
          timeout: 5000,
        });
      } else if ((data.accion || data.action) === "create") {
        const createMessage = `${data.bodega || "Desconocido"} - ${data.insumo || "Desconocido"}: ${data.cantidad || 0} unidades`;
        setNotifications((prev) => [
          ...prev.filter((n) => !n.message.includes(data.id?.toString())),
          { message: createMessage },
        ].slice(-1));
        addToast({
          title: "Insumo Creado",
          description: createMessage,
          timeout: 5000,
        });
      } else if ((data.accion || data.action) === "update") {
        const updateMessage = `${data.bodega || "Desconocido"} - ${data.insumo || "Desconocido"}: ${data.cantidad || 0} unidades`;
        setNotifications((prev) => [
          ...prev.filter((n) => !n.message.includes(data.id?.toString())),
          { message: updateMessage },
        ].slice(-1));
        addToast({
          title: "Insumo Actualizado",
          description: updateMessage,
          timeout: 5000,
        });
      } else if ((data.accion || data.action) === "delete") {
        const deleteMessage = `Registro ID ${data.id || "Desconocido"} eliminado`;
        setNotifications((prev) => [
          ...prev.filter((n) => !n.message.includes(data.id?.toString())),
          { message: deleteMessage },
        ].slice(-1));
        addToast({
          title: "Insumo Eliminado",
          description: deleteMessage,
          timeout: 5000,
        });
      } else {
        console.log("⚠️ Acción desconocida:", data.accion || data.action || "No especificada");
      }
    };

    socket.onerror = (error) => {
      console.error("❌ Error en WebSocket:", error);
      isConnectedRef.current = false;
      socketRef.current = null;
    };

    socket.onclose = (event) => {
      console.log("🔌 WebSocket cerrado", event);
      isConnectedRef.current = false;
      socketRef.current = null;
      processedMessages.current.clear();
      if (isAuthenticated) {
        reconnectAttempts.current += 1;
        console.log(`🔄 Intentando reconectar (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
        setTimeout(() => connectWebSocket(), 5000);
      }
    };
  };

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("⛔ WebSocket no iniciado: usuario no autenticado");
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([]);
    }, 10000);
    return () => clearTimeout(timer);
  }, [notifications]);

  if (!isAuthenticated) return null;
};

export default BodegaInsumoNotifications;