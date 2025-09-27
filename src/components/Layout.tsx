import React from 'react';
import { Package, BarChart3, TrendingUp, Upload, Eye, Settings } from 'lucide-react';

interface LayoutProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isEditorMode: boolean;
  onModeToggle: () => void;
  children: React.ReactNode;
}

export default function Layout({ 
  currentView, 
  onViewChange, 
  isEditorMode, 
  onModeToggle, 
  children 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-slate-200">
                <img
                  src="https://ecuajugos.com/wp-content/uploads/2019/06/ecuajugos-color@2xv1.png"
                  alt="Ecuajugos Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="bg-blue-600 p-2 rounded-lg hidden">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Sistema de Inventario Industrial</h1>
                <p className="text-sm text-slate-600">Ecuajugos S.A. - Gestión de Materiales</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => onViewChange('inventory')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'inventory'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Inventario</span>
              </button>
              <button
                onClick={() => onViewChange('movements')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'movements'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Movimientos</span>
              </button>
              <button
                onClick={() => onViewChange('reports')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'reports'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Reportes</span>
              </button>
              <button
                onClick={() => onViewChange('import-export')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'import-export'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Importar/Exportar</span>
              </button>
            </nav>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onModeToggle}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEditorMode
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                }`}
              >
                {isEditorMode ? (
                  <>
                    <Settings className="h-4 w-4" />
                    <span>Modo Editor</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Modo Espectador</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onViewChange('inventory')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'inventory'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Inventory
                </button>
                <button
                  onClick={() => onViewChange('movements')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'movements'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Movements
                </button>
              </nav>
            </div>
            <div className="flex items-center">
              <button
                onClick={onModeToggle}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isEditorMode
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isEditorMode ? 'Editor Mode' : 'Viewer Mode'}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}