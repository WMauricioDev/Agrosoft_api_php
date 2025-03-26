import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Lote } from "@/types/cultivo/Lotes";

const API_URL = "http://localhost/agrosoft_php/lote/";

const fetchLotes = async (): Promise<Lote[]> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
const registrarLote = async (lote: Lote) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const formData = new FormData();
  formData.append("nombre", lote.nombre);
  formData.append("descripcion", lote.descripcion);
  formData.append("estado", lote.estado); 
  formData.append("tamx", lote.tamx.toString());
  formData.append("tamy", lote.tamy.toString());
  formData.append("posx", lote.posx.toString());
  formData.append("posy", lote.posy.toString());

  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Error al registrar el lote");
  }

  return response.data;
};

export const useLotes = () => {
  return useQuery<Lote[], Error>({
    queryKey: ["lotes"],
    queryFn: fetchLotes,
  });
};

export const useRegistrarLote = () => {
  return useMutation({
    mutationFn: (lote: Lote) => registrarLote(lote),
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Lote registrado con éxito",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Error al registrar el lote",
      });
    },
  });
};
const actualizarLote = async (id: number, lote: Lote) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  try {
    const response = await axios.put(`${API_URL}${id}/`, lote, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en la API:", error.response?.data);
    throw error;
  }
};

export const useActualizarLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lote }: { id: number; lote: Lote }) => actualizarLote(id, lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] });
      addToast({ title: "Éxito", description: "Lote actualizado con éxito", timeout: 3000 });
    },
    onError: (error: any) => {
      addToast({ 
        title: "Error", 
        description: error.response?.data?.message || "Error al actualizar el lote", 
        timeout: 3000 
      });
    },
  });
};

const eliminarLote = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarLote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] });
      addToast({ title: "Éxito", description: "Lote eliminado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar el lote", timeout: 3000 });
    },
  });
};