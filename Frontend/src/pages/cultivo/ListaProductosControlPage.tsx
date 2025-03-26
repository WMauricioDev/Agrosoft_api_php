import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { ReuInput } from "../../components/globales/ReuInput";
import { ProductoControl } from "@/types/cultivo/ProductosControl"; // Asegúrate de definir esta interfaz
import { useProductoControl, useActualizarProductoControl, useEliminarProductoControl } from "../../hooks/cultivo/useproductoscontrol";
import ReuModal from "../../components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";

const ListaProductoControlPage: React.FC = () => {
  const [productoControl, setProductoControl] = useState<ProductoControl>({
    precio: 0,
    nombre: "",
    compuestoActivo: "",
    fichaTecnica: "",
    Contenido: 0,
    tipoContenido: "",
    unidades: 0,
  });

  const [selectedProductoControl, setSelectedProductoControl] = useState<ProductoControl | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const actualizarMutation = useActualizarProductoControl();
  const navigate = useNavigate();
  const eliminarMutation = useEliminarProductoControl();
  const { data: productosControl, isLoading } = useProductoControl();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Precio", uid: "precio" },
    { name: "Compuesto Activo", uid: "compuestoActivo" },
    { name: "Ficha Técnica", uid: "fichaTecnica" },
    { name: "Contenido", uid: "Contenido" },
    { name: "Tipo de Contenido", uid: "tipoContenido" },
    { name: "Unidades", uid: "unidades" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (productoControl: ProductoControl) => {
    setSelectedProductoControl(productoControl);
    setProductoControl(productoControl);
    setIsEditModalOpen(true);
  };

  const handleDelete = (productoControl: ProductoControl) => {
    setSelectedProductoControl(productoControl);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductoControl && selectedProductoControl.id !== undefined) {
      eliminarMutation.mutate(selectedProductoControl.id);
      setIsDeleteModalOpen(false);
    }
  };

  const transformedData = (productosControl ?? []).map((productoControl) => ({
    id: productoControl.id?.toString() || '',
    nombre: productoControl.nombre,
    precio: productoControl.precio,
    compuestoActivo: productoControl.compuestoActivo,
    fichaTecnica: productoControl.fichaTecnica,
    Contenido: productoControl.Contenido,
    tipoContenido: productoControl.tipoContenido,
    unidades: productoControl.unidades,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(productoControl)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(productoControl)}
        >
          Eliminar
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Productos de Control</h2>
          {isLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <>
              <Tabla columns={columns} data={transformedData} />
              <div className="flex justify-end mt-4">
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg 
                             hover:bg-blue-700 transition-all duration-300 ease-in-out 
                             shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => navigate('/cultivo/productoscontrol')} 
                >
                  Registrar Producto de Control
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Producto de Control"
        onConfirm={() => {
          if (selectedProductoControl && selectedProductoControl.id !== undefined) {
            actualizarMutation.mutate({
              id: selectedProductoControl.id,
              productoControl,
            });
            setIsEditModalOpen(false);
          }
        }}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={productoControl.nombre}
          onChange={(e) => setProductoControl({ ...productoControl, nombre: e.target.value })}
        />
        <ReuInput
          label="Precio"
          placeholder="Ingrese el precio"
          type="number"
          value={productoControl.precio.toString()}
          onChange={(e) => setProductoControl({ ...productoControl, precio: parseInt(e.target.value) })}
        />
        <ReuInput
          label="Compuesto Activo"
          placeholder="Ingrese el compuesto activo"
          type="text"
          value={productoControl.compuestoActivo}
          onChange={(e) => setProductoControl({ ...productoControl, compuestoActivo: e.target.value })}
        />
        <ReuInput
          label="Ficha Técnica"
          placeholder="Ingrese la ficha técnica"
          type="text"
          value={productoControl.fichaTecnica}
          onChange={(e) => setProductoControl({ ...productoControl, fichaTecnica: e.target.value })}
        />
        <ReuInput
          label="Contenido"
          placeholder="Ingrese el contenido"
          type="number"
          value={productoControl.Contenido.toString()}
          onChange={(e) => setProductoControl({ ...productoControl, Contenido: parseInt(e.target.value) })}
        />
        <ReuInput
          label="Tipo de Contenido"
          placeholder="Ingrese el tipo de contenido"
          type="text"
          value={productoControl.tipoContenido}
          onChange={(e) => setProductoControl({ ...productoControl, tipoContenido: e.target.value })}
        />
        <ReuInput
          label="Unidades"
          placeholder="Ingrese las unidades"
          type="number"
          value={productoControl.unidades.toString()}
          onChange={(e) => setProductoControl({ ...productoControl, unidades: parseInt(e.target.value) })}
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este producto de control?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaProductoControlPage;