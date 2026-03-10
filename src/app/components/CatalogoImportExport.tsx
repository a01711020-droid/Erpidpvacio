/**
 * Componente para Exportar Catálogo de Conceptos en formato Excel
 */

import { Button } from "@/app/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

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
  catalogoConceptos: Seccion[];
  nombreObra: string;
  codigoObra: string;
}

export default function CatalogoImportExport({
  catalogoConceptos,
  nombreObra,
  codigoObra,
}: Props) {
  // Función para descargar el catálogo como Excel
  const handleExportCatalogo = () => {
    // Crear workbook
    const workbook = XLSX.utils.book_new();

    // Preparar datos con marcadores de tipo de fila
    const rows: any[][] = [];
    
    // Header principal
    rows.push(["Clave", "Concepto", "Prot 1", "Prot 2", "etc .."]);

    catalogoConceptos.forEach((seccion) => {
      // Fila de sección
      rows.push(["", seccion.nombre, "", "", ""]);

      // Conceptos de la sección
      seccion.conceptos.forEach((concepto) => {
        rows.push([
          concepto.codigo,
          concepto.nombre,
          concepto.precios.prototipo70,
          concepto.precios.prototipo78,
          concepto.precios.prototipo88,
        ]);
      });
    });

    // Crear worksheet desde array
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Ajustar anchos de columna
    worksheet["!cols"] = [
      { wch: 12 }, // Clave
      { wch: 45 }, // Concepto
      { wch: 15 }, // Prot 1
      { wch: 15 }, // Prot 2
      { wch: 15 }, // etc ..
    ];

    // Aplicar estilos a las celdas
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        
        if (!cell) continue;

        // Inicializar objeto de estilo
        if (!cell.s) cell.s = {};

        // FILA 0: Header principal (azul oscuro, texto blanco, centrado, bold)
        if (R === 0) {
          cell.s = {
            fill: { fgColor: { rgb: "0F766E" } }, // Teal-700
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
        // Filas de SECCIÓN: Clave vacía (amarillo/naranja, texto bold)
        else if (C === 0 && (!cell.v || cell.v === "")) {
          // Es una fila de sección
          for (let colIdx = 0; colIdx <= range.e.c; colIdx++) {
            const secCellAddr = XLSX.utils.encode_cell({ r: R, c: colIdx });
            const secCell = worksheet[secCellAddr];
            if (secCell) {
              secCell.s = {
                fill: { fgColor: { rgb: "FCD34D" } }, // Amber-300
                font: { bold: true, sz: 11, color: { rgb: "78350F" } }, // Amber-900
                alignment: { horizontal: "left", vertical: "center" },
                border: {
                  top: { style: "medium", color: { rgb: "D97706" } },
                  bottom: { style: "medium", color: { rgb: "D97706" } },
                  left: { style: "thin", color: { rgb: "D97706" } },
                  right: { style: "thin", color: { rgb: "D97706" } },
                },
              };
            }
          }
        }
        // Filas de CONCEPTOS (blanco/gris alternado, bordes)
        else if (C === 0 && cell.v && cell.v !== "") {
          // Es una fila de concepto
          const isEven = R % 2 === 0;
          const bgColor = isEven ? "FFFFFF" : "F3F4F6"; // Blanco o Gray-100

          for (let colIdx = 0; colIdx <= range.e.c; colIdx++) {
            const conCellAddr = XLSX.utils.encode_cell({ r: R, c: colIdx });
            const conCell = worksheet[conCellAddr];
            if (conCell) {
              // Alineación según columna
              const alignment: any = { vertical: "center" };
              if (colIdx === 0) alignment.horizontal = "center"; // Clave centrada
              else if (colIdx === 1) alignment.horizontal = "left"; // Concepto izquierda
              else alignment.horizontal = "right"; // Precios a la derecha

              conCell.s = {
                fill: { fgColor: { rgb: bgColor } },
                font: { sz: 10 },
                alignment,
                border: {
                  top: { style: "thin", color: { rgb: "D1D5DB" } },
                  bottom: { style: "thin", color: { rgb: "D1D5DB" } },
                  left: { style: "thin", color: { rgb: "D1D5DB" } },
                  right: { style: "thin", color: { rgb: "D1D5DB" } },
                },
              };

              // Formato de moneda para columnas de precios
              if (colIdx >= 2 && typeof conCell.v === "number") {
                conCell.z = '"$"#,##0.00';
                conCell.s.font = { ...conCell.s.font, color: { rgb: "059669" } }; // Green-600
              }
            }
          }
        }
      }
    }

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Catálogo");

    // Descargar archivo
    const fileName = `Catalogo_${codigoObra}_${nombreObra.substring(0, 30)}.xlsx`;
    XLSX.writeFile(workbook, fileName, { cellStyles: true });
  };

  return (
    <Button
      onClick={handleExportCatalogo}
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      title="Descargar Catálogo Excel"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}