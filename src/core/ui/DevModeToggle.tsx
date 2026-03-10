/**
 * DEV MODE TOGGLE
 * 
 * Componente visual para cambiar entre modos de visualización
 * Solo visible en desarrollo para testing de UI
 */

import React, { useState } from 'react';
import { useDevMode, type DevMode } from '../contexts/DevModeContext';
import {
  Database,
  DatabaseZap,
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
  Zap,
} from 'lucide-react';

export function DevModeToggle() {
  const { mode, setMode, networkDelay, setNetworkDelay } = useDevMode();
  const [isOpen, setIsOpen] = useState(false);

  const modes: Array<{
    value: DevMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      value: 'withData',
      label: 'Con Datos Mock',
      description: '7 obras, 6 OCs, 3 pagos',
      icon: <Database className="h-4 w-4" />,
      color: 'bg-green-500',
    },
    {
      value: 'empty',
      label: 'Sin Datos (Empty)',
      description: 'Ver empty states + CTAs',
      icon: <DatabaseZap className="h-4 w-4" />,
      color: 'bg-orange-500',
    },
    {
      value: 'loading',
      label: 'Cargando...',
      description: 'Loading state permanente',
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      color: 'bg-blue-500',
    },
    {
      value: 'error',
      label: 'Error de Red',
      description: 'Simular fallo de conexión',
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'bg-red-500',
    },
  ];

  const currentMode = modes.find((m) => m.value === mode) || modes[0];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className={`w-2 h-2 rounded-full ${currentMode.color}`} />
        <span className="text-sm font-medium text-gray-700">
          {currentMode.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">
                🎨 Modo de Visualización
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Cambia entre estados para testing
              </p>
            </div>

            {/* Mode Options */}
            <div className="py-2">
              {modes.map((modeOption) => (
                <button
                  key={modeOption.value}
                  onClick={() => {
                    setMode(modeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    mode === modeOption.value ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${
                      mode === modeOption.value
                        ? modeOption.color
                        : 'bg-gray-100'
                    }`}
                  >
                    <div
                      className={
                        mode === modeOption.value
                          ? 'text-white'
                          : 'text-gray-600'
                      }
                    >
                      {modeOption.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {modeOption.label}
                      </span>
                      {mode === modeOption.value && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {modeOption.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Network Delay Toggle */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Zap
                    className={`h-4 w-4 ${
                      networkDelay ? 'text-yellow-600' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Simular latencia de red
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={networkDelay}
                    onChange={(e) => setNetworkDelay(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      networkDelay ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-1 ${
                        networkDelay ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-1.5">
                {networkDelay
                  ? 'Delay activo (200-600ms)'
                  : 'Respuestas instantáneas'}
              </p>
            </div>

            {/* Footer Info */}
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
              <p className="text-xs text-blue-700">
                💡 Tip: Usa <code className="px-1 py-0.5 bg-blue-100 rounded text-blue-800">Empty</code> para ver cómo se ve el sistema desde cero
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
