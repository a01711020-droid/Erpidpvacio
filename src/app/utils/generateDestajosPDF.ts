import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Lote {
  numero: string;
  prototipo: string;
}

interface ConceptoPrecio {
  prototipo70: number;
  prototipo78: number;
  prototipo88: number;
}

interface Concepto {
  id: string;
  codigo: string;
  nombre: string;
  precios: ConceptoPrecio;
}

interface Seccion {
  nombre: string;
  conceptos: Concepto[];
}

interface Obra {
  id: string;
  nombre: string;
  codigo: string;
  lotes: Lote[];
  catalogoConceptos: Seccion[];
}

interface Destajista {
  id: string;
  nombre: string;
  iniciales: string;
  color: string;
  especialidad: string;
}

interface HistoricoCaptura {
  semana: string;
  fecha: string;
  data: Record<string, string>;
}

/**
 * Convierte color hexadecimal a RGB
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Genera PDF de la Tabla de Captura Semanal de Destajos
 */
export function generateDestajosPDF(
  obra: Obra,
  capturaData: Record<string, string>,
  historicos: HistoricoCaptura[],
  destajistas: Destajista[]
) {
  // Crear documento en orientación horizontal (landscape) para mejor visualización
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Función helper para obtener el valor de una celda
  const getCellValue = (key: string): string => {
    // Primero buscar en históricos
    for (const hist of historicos) {
      if (hist.data[key]) return hist.data[key];
    }
    // Luego en captura actual
    return capturaData[key] || "";
  };

  // Función helper para verificar si es histórico
  const isHistorico = (key: string): boolean => {
    return historicos.some((h) => h.data[key]);
  };

  // Función helper para obtener color de destajista
  const getDestajistaColor = (iniciales: string): string => {
    const destajista = destajistas.find((d) => d.iniciales === iniciales);
    return destajista ? destajista.color : "#fbbf24";
  };

  // ===== PREPARAR DATOS DE LA TABLA =====
  const yStartTable = 10; // Iniciar cerca del borde superior

  // Calcular anchos de columnas para que sea simétrico
  const marginLeft = 10;
  const marginRight = 10;
  const availableWidth = pageWidth - marginLeft - marginRight;
  const claveWidth = 18;
  const conceptoWidth = 50;
  const lotesWidth = availableWidth - claveWidth - conceptoWidth;
  const loteWidth = lotesWidth / obra.lotes.length;

  // Primera fila del header: Nombre de obra + Lotes (números)
  const headerRow1: any[] = [
    {
      content: obra.nombre,
      colSpan: 2,
      styles: {
        fillColor: [58, 58, 58],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "left",
        cellPadding: 2,
      },
    },
    ...obra.lotes.map((lote) => ({
      content: lote.numero.replace(/_/g, " "),
      styles: {
        fillColor: [58, 58, 58],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
        cellPadding: 2,
      },
    })),
  ];

  // Segunda fila del header: Clave + Concepto + Prototipos
  const headerRow2: any[] = [
    {
      content: "Clave",
      styles: {
        fillColor: [58, 58, 58],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7,
        halign: "center",
        cellWidth: claveWidth,
        cellPadding: 2,
      },
    },
    {
      content: "Concepto",
      styles: {
        fillColor: [58, 58, 58],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7,
        halign: "left",
        cellWidth: conceptoWidth,
        cellPadding: 2,
      },
    },
    ...obra.lotes.map((lote) => ({
      content: lote.prototipo,
      styles: {
        fillColor: [58, 58, 58],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7,
        halign: "center",
        cellWidth: loteWidth,
        cellPadding: 2,
      },
    })),
  ];

  // Body de la tabla
  const tableBody: any[] = [];

  obra.catalogoConceptos.forEach((seccion) => {
    // Fila de sección
    tableBody.push([
      {
        content: seccion.nombre,
        colSpan: 2 + obra.lotes.length,
        styles: {
          fillColor: [45, 45, 45], // #2d2d2d
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
          halign: "left",
        },
      },
    ]);

    // Filas de conceptos
    seccion.conceptos.forEach((concepto, cIdx) => {
      const isOdd = cIdx % 2 === 1;
      const row: any[] = [
        {
          content: concepto.codigo,
          styles: {
            fillColor: isOdd ? [232, 232, 232] : [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            fontSize: 7,
            halign: "center",
            cellWidth: claveWidth,
          },
        },
        {
          content: concepto.nombre,
          styles: {
            fillColor: isOdd ? [232, 232, 232] : [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "normal",
            fontSize: 7,
            halign: "left",
            cellWidth: conceptoWidth,
          },
        },
      ];

      // Agregar celdas de lotes
      obra.lotes.forEach((lote) => {
        const key = `${concepto.id}-${lote.numero}`;
        const value = getCellValue(key);
        const isHist = isHistorico(key);

        let cellColor: [number, number, number];
        let textColor: [number, number, number];

        if (value) {
          if (isHist) {
            // Histórico - gris
            cellColor = [156, 163, 175]; // #9ca3af
            textColor = [255, 255, 255];
          } else {
            // Color del destajista
            const rgb = hexToRgb(getDestajistaColor(value));
            cellColor = rgb;
            textColor = [255, 255, 255];
          }
        } else {
          // Sin valor
          cellColor = isOdd ? [232, 232, 232] : [255, 255, 255];
          textColor = [0, 0, 0];
        }

        row.push({
          content: value || "",
          styles: {
            fillColor: cellColor,
            textColor: textColor,
            fontStyle: "bold",
            fontSize: 7,
            halign: "center",
            cellWidth: loteWidth,
          },
        });
      });

      tableBody.push(row);
    });
  });

  // ===== GENERAR TABLA CON autoTable =====
  autoTable(doc, {
    startY: yStartTable,
    head: [headerRow1, headerRow2],
    body: tableBody,
    theme: "grid",
    styles: {
      lineColor: [100, 100, 100],
      lineWidth: 0.3,
      cellPadding: 1,
    },
    headStyles: {
      lineColor: [100, 100, 100],
      lineWidth: 0.5,
    },
    bodyStyles: {
      lineColor: [100, 100, 100],
      lineWidth: 0.3,
    },
    margin: { top: yStartTable, left: marginLeft, right: marginRight, bottom: 20 },
    didDrawPage: (data) => {
      // Footer en cada página
      const pageCount = (doc as any).internal.getNumberOfPages();
      const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Página ${currentPage} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );
    },
  });

  // ===== PIE DE PÁGINA CON DESTAJISTAS =====
  const finalY = (doc as any).lastAutoTable.finalY || yStartTable + 50;

  // Información de destajistas en el pie
  let yInfo = finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Destajistas:", marginLeft, yInfo);
  yInfo += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  destajistas.forEach((dest) => {
    const rgb = hexToRgb(dest.color);
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(marginLeft, yInfo - 2.5, 5, 3, "F");

    doc.setTextColor(0, 0, 0);
    doc.text(
      `${dest.iniciales} - ${dest.nombre} (${dest.especialidad})`,
      marginLeft + 7,
      yInfo
    );
    yInfo += 4;
  });

  // ===== GUARDAR PDF =====
  const fileName = `Destajos_${obra.codigo}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
}