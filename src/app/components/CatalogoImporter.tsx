/**
 * Componente para Importar Catálogo de Conceptos desde Excel
 */

import { Button } from "@/app/components/ui/button";
import { Upload, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { useRef, useState, useEffect } from "react";

interface Concepto {
  id: string;
  codigo: string;
  nombre: string;
  precios: {
    prototipo70: number;
    prototipo78: number;
    prototipo88: number;
  };
}

interface Seccion {
  nombre: string;
  conceptos: Concepto[];
}

interface Props {
  onImportSuccess: (catalogo: Seccion[]) => void;
  nombreObra: string;
}

export default function CatalogoImporter({
  onImportSuccess,
  nombreObra,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Función para procesar el archivo importado
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Procesar datos
        const nuevoCatalogo: Seccion[] = [];
        let seccionActual: Seccion | null = null;

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || row.length === 0) continue;

          const clave = row[0] ? String(row[0]).trim() : "";
          const concepto = row[1] ? String(row[1]).trim() : "";
          const prot1 = row[2] ? Number(row[2]) : 0;
          const prot2 = row[3] ? Number(row[3]) : 0;
          const prot3 = row[4] ? Number(row[4]) : 0;

          // Si la clave está vacía, es una nueva sección
          if (!clave && concepto) {
            if (seccionActual) {
              nuevoCatalogo.push(seccionActual);
            }
            seccionActual = {
              nombre: concepto,
              conceptos: [],
            };
          }
          // Si la clave tiene valor, es un concepto
          else if (clave && concepto && seccionActual) {
            seccionActual.conceptos.push({
              id: `${clave}-${Date.now()}-${Math.random()}`,
              codigo: clave,
              nombre: concepto,
              precios: {
                prototipo70: prot1,
                prototipo78: prot2,
                prototipo88: prot3,
              },
            });
          }
        }

        // Agregar última sección
        if (seccionActual) {
          nuevoCatalogo.push(seccionActual);
        }

        // Validar que se importó algo
        if (nuevoCatalogo.length === 0) {
          throw new Error("El archivo no contiene secciones válidas");
        }

        // Callback con éxito
        onImportSuccess(nuevoCatalogo);
        setIsProcessing(false);
        setSuccess("Catálogo importado exitosamente");

        // Resetear input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err) {
        console.error("Error al importar catálogo:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error al procesar el archivo Excel"
        );
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("Error al leer el archivo");
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-100 rounded-lg">
          <FileSpreadsheet className="h-8 w-8 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-900 mb-2">
            📤 Importar Catálogo de Conceptos
          </h3>
          <p className="text-sm text-amber-800 mb-4">
            Sube un archivo Excel con la estructura del catálogo para actualizar
            los conceptos y precios de <strong>{nombreObra}</strong>.
          </p>

          <div className="space-y-3">
            <div className="text-xs text-amber-700 bg-white/50 rounded p-3">
              <p className="font-semibold mb-1">📋 Formato requerido:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Columnas:</strong> Clave | Concepto | Prot 1 | Prot 2 | etc ..</li>
                <li>• <strong>Secciones:</strong> Clave vacía, nombre en Concepto</li>
                <li>• <strong>Conceptos:</strong> Clave + Concepto + Precios numéricos</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
                <strong>❌ Error:</strong> {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded p-3 text-sm">
                <strong>✅ Éxito:</strong> {success}
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFile}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar Archivo Excel
                  </>
                )}
              </Button>
              <span className="text-xs text-amber-600">
                Formatos: .xlsx, .xls
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}