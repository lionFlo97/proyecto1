import React from "react";
import { Sun, Moon, Menu } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">📦 Control de Bodega</h1>
        </div>

        {/* Botón modo claro/oscuro */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white dark:bg-gray-800 shadow-md h-screen p-4">
            <nav className="space-y-3">
              <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                📊 Panel Principal
              </a>
              <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                📦 Inventario
              </a>
              <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                🔄 Movimientos
              </a>
              <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                📑 Reportes
              </a>
              <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                ⬆️ Importar / Exportar
              </a>
              <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                ⚙️ Configuración
              </a>
            </nav>
          </aside>
        )}

        {/* Contenido */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

