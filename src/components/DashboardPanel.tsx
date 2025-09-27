import React from 'react';
import { Package, AlertTriangle, TrendingUp, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface DashboardPanelProps {
  items: InventoryItem[];
}

export function DashboardPanel({ items }: DashboardPanelProps) {
  const totalItems = items.length;
  const availableItems = items.filter(item => item.stock > 0).length;
  const inUseItems = 0; // Placeholder - se puede implementar lógica de "en uso"
  const movements = 0; // Placeholder - se puede implementar historial de movimientos

  const criticalItems = items.filter(item => {
    const puntoPedido = item.puntoPedido || 5;
    return item.stock <= Math.floor(puntoPedido / 2) && item.stock > 0;
  });

  const lowStockItems = items.filter(item => {
    const puntoPedido = item.puntoPedido || 5;
    const criticalThreshold = Math.floor(puntoPedido / 2);
    return item.stock <= puntoPedido && item.stock > criticalThreshold;
  });

  const zeroStockItems = items.filter(item => item.stock === 0);
  const uniqueLocations = new Set(items.map(item => item.ubicacion)).size;

  const stats = [
    {
      label: 'Total Herramientas',
      value: totalItems,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      label: 'En Uso',
      value: inUseItems,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Disponibles',
      value: availableItems,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      label: 'Movimientos',
      value: movements,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-white rounded-2xl shadow-sm border ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alertas y notificaciones */}
      {(criticalItems.length > 0 || lowStockItems.length > 0 || zeroStockItems.length > 0) && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-xl font-bold text-red-900">Alertas de Inventario</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalItems.length > 0 && (
              <div className="bg-red-100 border border-red-300 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900">Stock Crítico</span>
                </div>
                <p className="text-red-800 mb-2">
                  <span className="text-2xl font-bold">{criticalItems.length}</span> materiales
                </p>
                <p className="text-sm text-red-700">Requieren reabastecimiento inmediato</p>
              </div>
            )}
            
            {lowStockItems.length > 0 && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">Stock Bajo</span>
                </div>
                <p className="text-yellow-800 mb-2">
                  <span className="text-2xl font-bold">{lowStockItems.length}</span> materiales
                </p>
                <p className="text-sm text-yellow-700">Próximos al punto de pedido</p>
              </div>
            )}

            {zeroStockItems.length > 0 && (
              <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <XCircle className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Sin Stock</span>
                </div>
                <p className="text-gray-800 mb-2">
                  <span className="text-2xl font-bold">{zeroStockItems.length}</span> materiales
                </p>
                <p className="text-sm text-gray-700">Completamente agotados</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sección de herramientas en uso */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-orange-100 p-3 rounded-xl">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Herramientas en Uso</h3>
        </div>
        
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4">
            <Clock className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <p className="text-gray-600 text-lg">No hay herramientas en uso</p>
          <p className="text-sm text-gray-500 mt-2">Los materiales prestados aparecerán aquí</p>
        </div>
      </div>

      {/* Últimos movimientos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-xl">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Últimos Movimientos</h3>
        </div>
        
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <p className="text-gray-600 text-lg">No hay movimientos recientes</p>
          <p className="text-sm text-gray-500 mt-2">Las entradas y salidas aparecerán aquí</p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ubicaciones</h3>
              <p className="text-sm text-gray-600">Distribución por almacén</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 mb-2">{uniqueLocations}</p>
            <p className="text-sm text-gray-600">Ubicaciones activas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tipos de Material</h3>
              <p className="text-sm text-gray-600">ERSA vs UNBW</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ERSA</span>
              <span className="font-semibold text-red-600">
                {items.filter(item => item.tipo === 'ERSA').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">UNBW</span>
              <span className="font-semibold text-blue-600">
                {items.filter(item => item.tipo === 'UNBW').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}