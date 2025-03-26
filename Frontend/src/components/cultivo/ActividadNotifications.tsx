import React, { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";

interface Notification {
  message: string;
}

interface ActividadNotificationsProps {
  userId: number;
}

const ActividadNotifications: React.FC<ActividadNotificationsProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    console.log("userId received:", userId);
    if (userId === 0) {
      console.error("El userId es 0. Asegúrate de pasar un ID válido.");
      return;
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/actividad/${userId}/`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Conectado al WebSocket:", wsUrl);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensaje recibido:", data.message);

      setNotifications((prev) => {
        const newNotifications = [...prev, { message: data.message }];
        console.log("Actualizando notificaciones:", newNotifications);
        return newNotifications;
      });

      // Asegurarse de que la notificación aparece
      addToast({
        title: "Nueva Actividad",
        description: data.message,
        timeout: 5000, 
      });
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket cerrado", event);
    };

    return () => {
      socket.close();
    };
  }, [userId]);

  return (
    <div>
      <h2>Notificaciones de Actividad</h2>
      {notifications.length === 0 ? (
        <p>No hay notificaciones</p>
      ) : (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>{notif.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActividadNotifications;
