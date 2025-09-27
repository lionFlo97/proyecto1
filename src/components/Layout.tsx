import React from 'react';

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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                Inventory Management
              </h1>
              <nav className="flex space-x-4">
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