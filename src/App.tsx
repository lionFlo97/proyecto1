import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet, Eye, Settings, Trash2, Download, Upload, BarChart3, TrendingUp, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Layout } from './components/Layout';
import { InventoryCard } from './components/InventoryCard';
import { EditItemModal } from './components/EditItemModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { ClearAllModal } from './components/ClearAllModal';
import { CriticalStockNotification } from './components/CriticalStockNotification';
import { CategoryView } from './components/CategoryView';
import { ViewerMode } from './components/ViewerMode';
import { SearchBar } from './components/SearchBar';
import { StockCriticalityCharts } from './components/StockCriticalityCharts';
import { MovementsPanel } from './components/MovementsPanel';
import { DashboardPanel } from './components/DashboardPanel';
import { ExportZeroStockModal } from './components/ExportZeroStockModal';
import { InventoryItem, NewInventoryItem } from './types/inventory';
import { AddItemModal } from './components/AddItemModal';
import { inventoryApi } from './services/api';
import { searchInventoryItem } from './utils/search';
import * as XLSX from 'xlsx';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventory' | 'movements' | 'reports' | 'import-export'>('dashboard');
  const [viewMode, setViewMode] = useState<'editor' | 'viewer'>('editor');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isExportZeroStockModalOpen, setIsExportZeroStockModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [deletingItems, setDeletingItems] = useState<Set<number>>(new Set());
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'critical' | 'zero'>('all');
  const [inventoryView, setInventoryView] = useState<'list' | 'categories'>('list');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (newItem: NewInventoryItem) => {
    try {
      setIsAdding(true);
      const addedItem = await inventoryApi.create(newItem);
      // Reload the entire inventory to ensure consistency
      await loadInventory();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleImportItems = async (newItems: NewInventoryItem[]) => {
    try {
      setIsImporting(true);
      await inventoryApi.createBulk(newItems);
      await loadInventory();
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Error importing items:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleUpdateStock = async (id: number, stock: number) => {
    try {
      setUpdatingItems(prev => new Set([...prev, id]));
      const updatedItem = await inventoryApi.updateStock(id, stock);
      if (updatedItem) {
        setItems(prev => prev.map(item => 
          item.id === id ? updatedItem : item
        ));
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = async (updatedItem: InventoryItem) => {
    try {
      setIsSaving(true);
      const savedItem = await inventoryApi.update(updatedItem.id, updatedItem);
      if (savedItem) {
        setItems(prev => prev.map(item => 
          item.id === updatedItem.id ? savedItem : item
        ));
        setIsEditModalOpen(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este material?')) {
      try {
        setDeletingItems(prev => new Set([...prev, id]));
        const deleted = await inventoryApi.delete(id);
        if (deleted) {
          await loadInventory();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }
  };

  const handleClearAll = async () => {
    try {
      setIsClearing(true);
      const cleared = await inventoryApi.clearAll();
      if (cleared) {
        await loadInventory();
        setIsClearAllModalOpen(false);
      }
    } catch (error) {
      console.error('Error clearing inventory:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportZeroStock = () => {
    const zeroStockItems = items.filter(item => item.stock === 0);
    
    if (zeroStockItems.length === 0) {
      alert('No hay materiales con stock cero para exportar.');
      return;
    }

    const exportData = zeroStockItems.map(item => ({
      'Tipo': item.tipo,
      'Nombre': item.nombre,
      'Código': item.codigo,
      'Ubicación': item.ubicacion,
      'Stock': item.stock,
      'Unidad': item.unidad,
      'Punto Pedido': item.puntoPedido || 5,
      'Punto Máximo': item.puntoMaximo || 0,
      'Categoría': item.categoria || 'Sin categoría'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Cero');
    XLSX.writeFile(wb, `materiales_stock_cero_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = searchInventoryItem(item, searchTerm);
    
    const puntoPedido = item.puntoPedido || 5;
    const criticalThreshold = Math.floor(puntoPedido / 2);
    const matchesFilter = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && item.stock <= puntoPedido && item.stock > criticalThreshold) ||
      (stockFilter === 'critical' && item.stock <= criticalThreshold && item.stock > 0) ||
      (stockFilter === 'zero' && item.stock === 0);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Layout currentView={currentView} onViewChange={setCurrentView} isEditorMode={viewMode === 'editor'} onModeToggle={() => setViewMode(prev => prev === 'editor' ? 'viewer' : 'editor')}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando inventario...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Modo espectador
  if (viewMode === 'viewer') {
    return <ViewerMode onBackToEditor={() => setViewMode('editor')} />;
  }

  // Renderizar contenido según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPanel items={items} />;
      
      case 'movements':
        return <MovementsPanel items={items} onUpdateStock={handleUpdateStock} />;
      
      case 'reports':
        return <StockCriticalityCharts items={items} />;
      
      case 'import-export':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Importar Excel</h3>
                    <p className="text-sm text-gray-600">Cargar materiales desde archivo</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Importar Archivo
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Download className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Exportar Stock Cero</h3>
                    <p className="text-sm text-gray-600">Descargar materiales sin stock</p>
                  </div>
                </div>
                <button
                  onClick={handleExportZeroStock}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Exportar Excel
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Limpiar Inventario</h3>
                    <p className="text-sm text-gray-600">Eliminar todos los materiales</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsClearAllModalOpen(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Borrar Todo
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'inventory':
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                  <span>Agregar Material</span>
                </button>
                
                <button
                  onClick={() => setViewMode('viewer')}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                >
                  <Eye className="h-5 w-5" />
                  <span>Modo Espectador</span>
                </button>
              </div>
            </div>

            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              stockFilter={stockFilter}
              onFilterChange={setStockFilter}
            />

            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setInventoryView('list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    inventoryView === 'list'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Lista</span>
                </button>
                <button
                  onClick={() => setInventoryView('categories')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    inventoryView === 'categories'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Categorías</span>
                </button>
              </div>
            </div>

            {inventoryView === 'categories' ? (
              <CategoryView
                items={filteredItems}
                onUpdateStock={handleUpdateStock}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={handleAddItem}
                updatingItems={updatingItems}
                deletingItems={deletingItems}
                isAdding={isAdding}
              />
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="max-w-sm mx-auto">
                  <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                    <Package className="h-12 w-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {searchTerm || stockFilter !== 'all' ? 'No se encontraron materiales' : 'No hay materiales'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || stockFilter !== 'all' 
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Comienza agregando tu primer material al inventario'
                    }
                  </p>
                  {!searchTerm && stockFilter === 'all' && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Agregar Material</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <InventoryCard
                    key={item.id}
                    item={item}
                    onUpdateStock={handleUpdateStock}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    isUpdating={updatingItems.has(item.id)}
                    isDeleting={deletingItems.has(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      isEditorMode={viewMode === 'editor'} 
      onModeToggle={() => setViewMode(prev => prev === 'editor' ? 'viewer' : 'editor')}
    >
      <CriticalStockNotification items={items} />
      {renderContent()}

        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
          isAdding={isAdding}
        />

        {editingItem && (
          <EditItemModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
            }}
            onSave={handleSaveItem}
            item={editingItem}
            isSaving={isSaving}
          />
        )}

        <ImportExcelModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportItems}
          isImporting={isImporting}
        />

        <ClearAllModal
          isOpen={isClearAllModalOpen}
          onClose={() => setIsClearAllModalOpen(false)}
          onConfirm={handleClearAll}
          isClearing={isClearing}
          totalItems={items.length}
        />
    </Layout>
  );
}

export default App;