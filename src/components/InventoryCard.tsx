import React, { useState } from "react";
import { InventoryCard } from "./components/InventoryCard";
import { InventoryItem } from "./types/inventory";

export default function App() {
  // 🔹 Lista de ejemplo de inventario (reemplaza con tu API/estado real)
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      nombre: "Cable HDMI",
      stock: 10,
      unidad: "pcs",
      tipo: "ERSA",
      codigo: "HDMI123",
      ubicacion: "Bodega 1",
      puntoPedido: 5,
      foto: "",
    },
    {
      id: 2,
      nombre: "Laptop Dell",
      stock: 3,
      unidad: "pcs",
      tipo: "Equipo",
      codigo: "LAP456",
      ubicacion: "Oficina 2",
      puntoPedido: 2,
      foto: "",
    },
  ]);

  // 🔹 Simulación de rol (puede venir de login)
  const [userRole, setUserRole] = useState<"Tecnico" | "administrador" | null>("Tecnico");

  // 🔹 Estado del carrito (solo técnicos)
  const [cart, setCart] = useState<InventoryItem[]>([]);

  // Actualizar stock
  const handleUpdateStock = (id: number, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
    );
  };

  // Editar item (solo admin)
  const handleEditItem = (item: InventoryItem) => {
    console.log("Editar:", item);
  };

  // Eliminar item (solo admin)
  const handleDeleteItem = (id: number) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔹 Agregar al carrito (solo técnicos)
  const handleAddToCart = (item: InventoryItem) => {
    setCart((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev; // evitar duplicados
      return [...prev, item];
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📦 Inventario</h1>

      {/* Selector de rol */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setUserRole("administrador")}
          className={`px-4 py-2 rounded ${userRole === "administrador" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Administrador
        </button>
        <button
          onClick={() => setUserRole("Tecnico")}
          className={`px-4 py-2 rounded ${userRole === "Tecnico" ? "bg-orange-600 text-white" : "bg-gray-200"}`}
        >
          Técnico
        </button>
      </div>

      {/* Lista de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inventory.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onUpdateStock={handleUpdateStock}
            onEditItem={userRole === "administrador" ? handleEditItem : undefined}
            onDeleteItem={userRole === "administrador" ? handleDeleteItem : undefined}
            isUpdating={false}
            isDeleting={false}
            userRole={userRole}
            onAddToCart={handleAddToCart} // 👈 conexión
          />
        ))}
      </div>

      {/* Carrito visible solo si es Técnico */}
      {userRole === "Tecnico" && (
        <div className="mt-8 p-4 bg-orange-100 rounded-lg">
          <h2 className="text-xl font-bold mb-2">🛒 Carrito</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío</p>
          ) : (
            <ul className="list-disc pl-6 space-y-1">
              {cart.map((item) => (
                <li key={item.id} className="text-gray-800">
                  {item.nombre} - {item.stock} {item.unidad}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
