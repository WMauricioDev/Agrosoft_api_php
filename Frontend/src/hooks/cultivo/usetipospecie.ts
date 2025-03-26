import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { TipoEspecie } from "@/types/cultivo/TipoEspecie";

const API_URL = "http://localhost/agrosoft_php/tipoespecie/";

const fetchTipoEspecies = async (): Promise<TipoEspecie[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // La API de PHP devuelve los datos en el campo "data"
  return response.data.data;
};

const registrarTipoEspecie = async (tipoEspecie: TipoEspecie) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.post(API_URL, tipoEspecie, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // Devuelve la respuesta completa
};

const actualizarTipoEspecie = async (id: number, tipoEspecie: TipoEspecie) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.put(`${API_URL}${id}`, tipoEspecie, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // Devuelve la respuesta completa
};

const eliminarTipoEspecie = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.delete(`${API_URL}${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data; // Devuelve la respuesta completa
};

export const useTipoEspecies = () => {
  return useQuery<TipoEspecie[], Error>({
    queryKey: ["tipoEspecies"],
    queryFn: fetchTipoEspecies,
  });
};
export const useRegistrarTipoEspecie = () => {
  return useMutation({
    mutationFn: registrarTipoEspecie,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Tipo de especie registrado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al registrar el tipo de especie", timeout: 3000 });
    },
  });
};

export const useActualizarTipoEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoEspecie }: { id: number; tipoEspecie: TipoEspecie }) =>
      actualizarTipoEspecie(id, tipoEspecie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoEspecies"] });
      addToast({ title: "Éxito", description: "Tipo de especie actualizado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al actualizar el tipo de especie", timeout: 3000 });
    },
  });
};

export const useEliminarTipoEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoEspecie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoEspecies"] });
      addToast({ title: "Éxito", description: "Tipo de especie eliminado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar el tipo de especie", timeout: 3000 });
    },
  });
};