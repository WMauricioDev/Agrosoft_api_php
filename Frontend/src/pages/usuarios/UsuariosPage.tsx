import React, { useState, FormEvent, useMemo } from "react";
import DefaultLayout from "@/layouts/default";
import { useUsuarios, UsuarioUpdate } from "@/hooks/usuarios/useUsuarios";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const UsuariosPage: React.FC = () => {
  const { user } = useAuth();
  const { data: usuarios = [], isLoading, error, updateUsuario, deleteUsuario, roles = [], isLoadingRoles } = useUsuarios();
  
  const [editUsuario, setEditUsuario] = useState<{ id: number; nombre: string; apellido: string; email: string; username?: string; rol: { id: number; rol: string } | null } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  if (!user || user.rol?.rol.toLowerCase() !== "administrador") {
    return <Navigate to="/perfil" replace />;
  }

  const columns = [
    { name: "IDENTIFICACIÓN", uid: "id" },
    { name: "Nombre", uid: "nombre" },
    { name: "Apellido", uid: "apellido" },
    { name: "Correo electrónico", uid: "email" },
    { name: "Nombre de usuario", uid: "username" },
    { name: "Rol", uid: "rol" },
    { name: "Acciones", uid: "acciones" },
  ];

  const filteredUsuarios = useMemo(() => {
    let result = [...usuarios];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((u) =>
        String(u.id).includes(lowerSearch) ||
        u.nombre.toLowerCase().includes(lowerSearch) ||
        u.apellido.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch) ||
        (u.username && u.username.toLowerCase().includes(lowerSearch)) ||
        (u.rol && u.rol.rol.toLowerCase().includes(lowerSearch))
      );
    }
    result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return result;
  }, [usuarios, searchTerm]);

  const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
  const paginatedUsuarios = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    return filteredUsuarios.slice(start, end);
  }, [filteredUsuarios, currentPage, usersPerPage]);

  // Funciones de paginación sin límite
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleEdit = (usuario: typeof editUsuario) => {
    setEditUsuario(usuario ? { ...usuario } : null);
    setEditError(null);
  };

  const handleDelete = (id: number) => {
    if (confirmDelete === id) {
      deleteUsuario(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editUsuario) return;
    try {
      const usuarioToUpdate: UsuarioUpdate = {
        id: editUsuario.id,
        nombre: editUsuario.nombre,
        apellido: editUsuario.apellido,
        email: editUsuario.email,
        username: editUsuario.username,
        rol_id: editUsuario.rol ? editUsuario.rol.id : null,
      };
      await updateUsuario(usuarioToUpdate);
      setEditUsuario(null);
      setEditError(null);
    } catch (err: any) {
      setEditError(err.response?.data?.detail || "No se pudo actualizar el usuario.");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    if (editUsuario) {
      if (field === "rol") {
        const selectedRol = roles.find((r) => r.id === Number(value));
        setEditUsuario({ ...editUsuario, rol: selectedRol || null });
      } else {
        setEditUsuario({ ...editUsuario, [field]: value });
      }
    }
  };

  console.log("Rendering pagination - Current page:", currentPage, "Total pages:", totalPages);

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Lista de Usuarios</h2>
            <div className="w-64">
              <TextField
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="ID, nombre, email..."
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-600 text-center">Cargando usuarios...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Error al cargar usuarios: {error.message}</p>
          ) : filteredUsuarios.length === 0 ? (
            <p className="text-gray-600 text-center">No hay usuarios disponibles.</p>
          ) : (
            <>
              <Table aria-label="Tabla de usuarios">
                <TableHeader>
                  {columns.map((col) => (
                    <TableColumn key={col.uid}>{col.name}</TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {paginatedUsuarios.length === 0 && currentPage > totalPages ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-600">
                        No hay más datos disponibles.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>{usuario.id}</TableCell>
                        <TableCell>{usuario.nombre}</TableCell>
                        <TableCell>{usuario.apellido}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.username || "N/A"}</TableCell>
                        <TableCell>{usuario.rol?.rol || "Sin rol"}</TableCell>
                        <TableCell>
                          <button className="text-green-500 hover:underline mr-2" onClick={() => handleEdit(usuario)}>
                            Editar
                          </button>
                          {confirmDelete === usuario.id ? (
                            <span className="text-gray-700">
                              ¿Seguro?{" "}
                              <button className="text-red-500 hover:underline ml-1" onClick={() => handleDelete(usuario.id)}>
                                Sí
                              </button>{" "}
                              <button className="text-green-500 hover:underline ml-1" onClick={() => setConfirmDelete(null)}>
                                No
                              </button>
                            </span>
                          ) : (
                            <button className="text-red-500 hover:underline" onClick={() => setConfirmDelete(usuario.id)}>
                              Eliminar
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 0 && (
                <div className="flex justify-center mt-4 gap-4" key={currentPage}>
                  <Button variant="outlined" onClick={handlePrevPage} disabled={currentPage === 1}>
                    ← Anterior
                  </Button>
                  <span className="self-center text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button variant="outlined" onClick={handleNextPage}>
                    Siguiente →
                  </Button>
                </div>
              )}
            </>
          )}

          {editUsuario && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2.5, width: "100%", maxWidth: "600px", mx: "auto" }}>
              <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", color: "#1a202c" }}>
                Editar Usuario
              </Typography>
              {editError && (
                <Typography variant="body2" sx={{ color: "#f56565", textAlign: "center" }}>
                  {editError}
                </Typography>
              )}
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <TextField
                    label="Nombre"
                    value={editUsuario.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    fullWidth
                    required
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <TextField
                    label="Apellido"
                    value={editUsuario.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                    fullWidth
                    required
                  />
                </motion.div>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <TextField
                    type="email"
                    label="Email"
                    value={editUsuario.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    fullWidth
                    required
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                  <TextField
                    label="Username"
                    value={editUsuario.username || ""}
                    onChange={(e) => handleChange("username", e.target.value)}
                    fullWidth
                  />
                </motion.div>
              </Box>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={editUsuario.rol?.id || ""}
                  onChange={(e) => handleChange("rol", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccione un rol</option>
                  {isLoadingRoles ? (
                    <option value="">Cargando roles...</option>
                  ) : (
                    roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.rol}
                      </option>
                    ))
                  )}
                </select>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button type="submit" variant="contained" sx={{ backgroundColor: "#2ecc71" }}>
                    Guardar
                  </Button>
                  <Button variant="outlined" onClick={() => setEditUsuario(null)} sx={{ borderColor: "#f56565", color: "#f56565" }}>
                    Cancelar
                  </Button>
                </Box>
              </motion.div>
            </Box>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UsuariosPage;