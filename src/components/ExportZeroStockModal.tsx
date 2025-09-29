import React from 'react';
import { X, Download, Package } from 'lucide-react';

interface ExportZeroStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  zeroStockCount: number;
}

export function ExportZeroStockModal({ isOpen, onClose, onExport, zeroStockCount }: ExportZeroStockModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Download className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Exportar Stock Cero</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Materiales sin stock</h3>
                <p className="text-sm text-blue-800">
                  Se exportarán <strong>{zeroStockCount}</strong> materiales con stock cero
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">El archivo Excel incluirá:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Tipo de material (ERSA/UNBW)</li>
              <li>Nombre y código</li>
              <li>Ubicación</li>
              <li>Unidad de medida</li>
              <li>Puntos de pedido y máximo</li>
              <li>Categoría</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onExport();
                onClose();
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Descargar Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}