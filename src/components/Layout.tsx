import React from 'react';
import { Package, Settings, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onViewChange?: (view: string) => void;
  isEditorMode?: boolean;
  onModeToggle?: () => void;
}

export function Layout({ children, currentView = 'dashboard', onViewChange, isEditorMode = true, onModeToggle }: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Package },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'movements', label: 'Movimientos', icon: Package },
    { id: 'reports', label: 'Reportes', icon: Package },
    { id: 'import-export', label: 'Importar/Exportar', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Logo y título */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
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
              <Package className="h-6 w-6 text-white hidden" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Control de Inventario</h1>
              <p className="text-sm text-gray-600">Ecuajugos S.A. - Grupo Gloria</p>
            </div>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange?.(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Usuario y configuración */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Administrador</p>
                <p className="text-xs text-gray-500">Administración</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={onModeToggle}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditorMode
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            <span>{isEditorMode ? 'Modo Editor' : 'Modo Espectador'}</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header superior */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentView === 'dashboard' && 'Panel Principal'}
                {currentView === 'inventory' && 'Inventario'}
                {currentView === 'movements' && 'Movimientos'}
                {currentView === 'reports' && 'Reportes'}
                {currentView === 'import-export' && 'Importar/Exportar'}
              </h2>
              <p className="text-gray-600">Sistema de Gestión Industrial</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Desarrollado por Dennis Quinche</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
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
                <h1 className="text-xl font-bold text-slate-900">Mi bodega EJ-TEC</h1>
                <p className="text-sm text-slate-600">Sistema de Gestión Industrial -  Ecuajugos S.A.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Wrench className="h-5 w-5" />
              <span className="text-sm font-medium">Stock de Inventario</span>
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