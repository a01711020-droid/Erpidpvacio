import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DetalleDestajista {
  concepto: string;
  codigo: string;
  lote: string;
  prototipo: string;
  monto: number;
  semana: string;
  fechaSemana?: string;
  isNota?: boolean;
  isHistorico?: boolean;
}

interface Destajista {
  id: string;
  nombre: string;
  iniciales: string;
  color: string;
  especialidad: string;
}

interface Obra {
  id: string;
  nombre: string;
  codigo: string;
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
 * Genera PDF de la Remisión Individual de Destajista - Formato Minimalista
 */
export function generateRemisionPDF(
  obra: Obra,
  destajista: Destajista,
  detalles: DetalleDestajista[],
  total: number
) {
  // Crear documento en orientación vertical
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Generar código de remisión: Iniciales|numero de obra|S|numero de semana del año
  const weekNumber = Math.ceil(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
      (1000 * 60 * 60 * 24 * 7)
  );
  const obraNumero = obra.codigo.split("-")[1] || "001";
  const codigoRemision = `${destajista.iniciales}${obraNumero}S${weekNumber}`;

  // ===== TÍTULO CENTRADO =====
  const marginTop = 25;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`${obra.codigo} - ${obra.nombre}`, pageWidth / 2, marginTop, {
    align: "center",
  });

  // ===== TABLA CENTRADA CON BORDES HORIZONTALES =====
  const yStartTable = marginTop + 10;
  const marginX = 20; // Márgenes simétricos

  // Preparar datos de la tabla
  const tableData: any[] = [];

  detalles.forEach((detalle, idx) => {
    const isNota = detalle.semana === "Nota Externa";
    const rowRgb = hexToRgb(destajista.color);

    tableData.push([
      {
        content: (idx + 1).toString(),
        styles: {
          halign: "center",
          valign: "middle",
          fontStyle: "bold",
          fontSize: 9,
          textColor: [0, 0, 0],
        },
      },
      {
        content: destajista.iniciales,
        styles: {
          halign: "center",
          valign: "middle",
          fillColor: rowRgb,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
      },
      {
        content: detalle.codigo,
        styles: {
          halign: "center",
          valign: "middle",
          fontStyle: "bold",
          fontSize: 9,
          textColor: [0, 0, 0],
          fillColor: isNota ? [254, 243, 199] : undefined,
        },
      },
      {
        content: detalle.prototipo,
        styles: {
          halign: "center",
          valign: "middle",
          fontStyle: "bold",
          fontSize: 9,
          textColor: [0, 0, 0],
          fillColor: isNota ? [254, 243, 199] : undefined,
        },
      },
      {
        content: detalle.lote.replace(/_/g, " "),
        styles: {
          halign: "center",
          valign: "middle",
          fontStyle: "bold",
          fontSize: 9,
          textColor: [0, 0, 0],
          fillColor: isNota ? [254, 243, 199] : undefined,
        },
      },
      {
        content: detalle.concepto,
        styles: {
          halign: "left",
          valign: "middle",
          fontSize: 9,
          textColor: [0, 0, 0],
          cellPadding: { left: 3, right: 2, top: 2, bottom: 2 },
          fillColor: isNota ? [254, 243, 199] : undefined,
        },
      },
      {
        content: `$${detalle.monto.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        styles: {
          halign: "right",
          valign: "middle",
          fontStyle: "bold",
          fontSize: 9,
          textColor: detalle.monto < 0 ? [220, 38, 38] : [0, 0, 0],
          fillColor: isNota ? [254, 243, 199] : undefined,
        },
      },
    ]);
  });

  // Fila de total - delgada sin palabra "CÓDIGO"
  tableData.push([
    {
      content: codigoRemision,
      colSpan: 6,
      styles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
        halign: "left",
        cellPadding: 2,
      },
    },
    {
      content: `$${total.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      styles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 12,
        halign: "right",
        cellPadding: 2,
      },
    },
  ]);

  // ===== GENERAR TABLA CON autoTable =====
  autoTable(doc, {
    startY: yStartTable,
    head: [
      [
        {
          content: "No.",
          styles: {
            fillColor: [51, 65, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 2,
          },
        },
        {
          content: "Iniciales",
          styles: {
            fillColor: [51, 65, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 2,
          },
        },
        {
          content: "Clave",
          styles: {
            fillColor: [51, 65, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 2,
          },
        },
        {
          content: "Prototipo",
          styles: {
            fillColor: [51, 65, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 2,
          },
        },
        {
          content: "Lote",
          styles: {
            fillColor: [51, 65, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 2,
          },
        },
        {
          content: "Concepto",
          styles: {
            fillColor: [51, 65, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "left",
            cellPadding: 2,
          },
        },
        {
          content: "Importe",
          styles: {
            fillColor: [51, 65, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "right",
            cellPadding: 2,
          },
        },
      ],
    ],
    body: tableData,
    theme: "plain",
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0,
      cellPadding: 2,
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    headStyles: {
      lineColor: [0, 0, 0],
      lineWidth: { bottom: 0.5 },
    },
    bodyStyles: {
      lineColor: [0, 0, 0],
      lineWidth: { bottom: 0.3 },
    },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 20 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 22 },
      5: { cellWidth: "auto", minCellWidth: 50 },
      6: { cellWidth: 32 },
    },
    margin: { top: yStartTable, left: marginX, right: marginX, bottom: 20 },
    tableWidth: "auto",
    didDrawCell: (data) => {
      // Solo dibujar líneas horizontales
      if (data.section === "body" || data.section === "head") {
        const { cell, cursor } = data;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        // Línea inferior de cada celda
        doc.line(
          cursor.x,
          cursor.y + cell.height,
          cursor.x + cell.width,
          cursor.y + cell.height
        );
      }
    },
  });

  // ===== GUARDAR PDF =====
  const fileName = `Remision_${codigoRemision}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
}
