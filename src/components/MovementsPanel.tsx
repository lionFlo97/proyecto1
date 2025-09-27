import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, Clock, User, Package, Calendar, Search } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { MaterialExit } from '../types/materialExit';
import { materialExitApi } from '../services/materialExitApi';
import { MaterialExitModal } from './MaterialExitModal';
import { NewMaterialExit } from '../types/materialExit';

interface MovementsPanelProps {
  items: InventoryItem[];
  onUpdateStock: (id: number, stock: number) => void;
}

export function MovementsPanel({ items, onUpdateStock }: MovementsPanelProps) {
  const [exits, setExits] = useState<MaterialExit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryItem | null>(null);
  const [isProcessingExit, setIsProcessingExit] = useState(false);

  useEffect(() => {
    loadExits();
  }, []);

  const loadExits = async () => {
    try {
      setLoading(true);
      const data = await materialExitApi.getAll();
      setExits(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error loading exits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialExit = (material: InventoryItem) => {
    setSelectedMaterial(material);
    setIsExitModalOpen(true);
  };

  const handleConfirmExit = async (exitData: NewMaterialExit) => {
    if (!selectedMaterial) return;

    try {
      setIsProcessingExit(true);
      await materialExitApi.create(exitData, selectedMaterial);
      
      // Actualizar el stock del material
      const newStock = selectedMaterial.stock - exitData.quantity;
      onUpdateStock(selectedMaterial.id, newStock);
      
      setIsExitModalOpen(false);
      setSelectedMaterial(null);
      await loadExits();
    } catch (error) {
      console.error('Error processing material exit:', error);
    } finally {
      setIsProcessingExit(false);
    }
  };

  const filteredExits = exits.filter(exit =>
    exit.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exit.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exit.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exit.personLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exit.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayExits = exits.filter(exit => {
    const exitDate = new Date(exit.createdAt);
    const today = new Date();
    return exitDate.toDateString() === today.toDateString();
  });

  const thisWeekExits = exits.filter(exit => {
    const exitDate = new Date(exit.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return exitDate >= weekAgo;
  });

  return (
    <div className="space-y-8">
      {/* Estadísticas de movimientos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <ArrowDownLeft className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{exits.length}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Salidas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{todayExits.length}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Salidas Hoy</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{thisWeekExits.length}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Esta Semana</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <ArrowUpRight className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Entradas</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Movimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              // Seleccionar material para salida
              const availableMaterials = items.filter(item => item.stock > 0);
              if (availableMaterials.length > 0) {
                setSelectedMaterial(availableMaterials[0]);
                setIsExitModalOpen(true);
              }
            }}
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            <ArrowDownLeft className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Registrar Salida</p>
              <p className="text-sm text-blue-700">Material entregado</p>
            </div>
          </button>

          <button
            disabled
            className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed"
          >
            <ArrowUpRight className="h-6 w-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-600">Registrar Entrada</p>
              <p className="text-sm text-gray-500">Próximamente</p>
            </div>
          </button>

          <button
            disabled
            className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed"
          >
            <Package className="h-6 w-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-600">Ajuste de Inventario</p>
              <p className="text-sm text-gray-500">Próximamente</p>
            </div>
          </button>
        </div>
      </div>

      {/* Historial de movimientos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h3>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por material, código, persona o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando movimientos...</span>
            </div>
          ) : filteredExits.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4">
                <Clock className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron movimientos' : 'Sin movimientos registrados'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los movimientos de materiales aparecerán aquí'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExits.map((exit) => (
                <div key={exit.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <ArrowDownLeft className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{exit.materialName}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            exit.materialType === 'ERSA' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {exit.materialType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Código: {exit.materialCode} | Ubicación: {exit.materialLocation}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Persona:</p>
                            <p className="font-medium text-gray-900">{exit.personName} {exit.personLastName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Área:</p>
                            <p className="font-medium text-gray-900">{exit.area}</p>
                            {exit.ceco && <p className="text-xs text-gray-500">CECO: {exit.ceco}</p>}
                            {exit.workOrder && <p className="text-xs text-gray-500">OT: {exit.workOrder}</p>}
                          </div>
                          <div>
                            <p className="text-gray-500">Cantidad:</p>
                            <p className="font-medium text-gray-900">{exit.quantity} unidades</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{exit.exitDate}</p>
                      <p>{exit.exitTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MaterialExitModal
        isOpen={isExitModalOpen}
        onClose={() => {
          setIsExitModalOpen(false);
          setSelectedMaterial(null);
        }}
        onConfirm={handleConfirmExit}
        material={selectedMaterial}
        isProcessing={isProcessingExit}
      />
    </div>
  );
}