import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Genera el PDF de una Orden de Compra
 * Usa jsPDF + jspdf-autotable
 * Convierte SVG a imagen vía Canvas para compatibilidad
 */
export async function generatePurchaseOrderPDF(order: {
  orderNumber: string;
  createdDate: string;
  workCode: string;
  workName: string;
  client?: string;
  buyer: string;
  supplier: string;
  supplierFullName?: string;
  supplierContact?: string;
  supplierAddress?: string;
  workResident?: string;
  workPhone?: string;
  workAddress?: string;
  deliveryType: string;
  deliveryDate: string;
  items: {
    quantity: number;
    unit?: string;
    description: string;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  iva: number;
  total: number;
  observations?: string;
}) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* =====================================================
     HEADER - Borde azul oscuro
     ===================================================== */
  
  // Rectángulo azul oscuro superior con borde delgado
  doc.setFillColor(0, 59, 122); // #003B7A - azul oscuro
  doc.rect(10, 10, pageWidth - 20, 30, "F");
  
  // Borde exterior más delgado (0.2mm)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(10, 10, pageWidth - 20, 30, "S");

  // Marco amarillo para el logo (placeholder visual)
  doc.setFillColor(255, 204, 0); // Amarillo IDP
  doc.rect(12, 12, 26, 26, "F");
  
  // Borde del marco amarillo
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, 26, 26, "S");
  
  // Texto "LOGO" en el marco amarillo
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("LOGO", 25, 25, { align: "center" });
  doc.setFontSize(6);
  doc.text("IDP", 25, 29, { align: "center" });

  // Intentar cargar logo real si existe
  try {
    const logoImage = await svgToDataURL("/logo-idp-alterno.svg", 100, 100);
    // Si el logo carga, reemplazar el placeholder amarillo
    doc.setFillColor(255, 204, 0);
    doc.rect(12, 12, 26, 26, "F");
    doc.addImage(logoImage, "PNG", 12, 12, 26, 26);
  } catch (error) {
    // Si falla, el placeholder amarillo ya está dibujado - no mostrar error
    // console.warn("No se pudo cargar el logo, usando placeholder amarillo:", error);
  }

  // Título "ORDEN DE COMPRA" centrado en BLANCO
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ORDEN DE COMPRA", pageWidth / 2, 18, { align: "center" });

  // Datos de la empresa (pegados a la izquierda, cerca del logo) en BLANCO
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text("IDP CC SC DE RL DE CV", 40, 15);
  doc.text("RFC: ICC110321LN0", 40, 19);
  doc.text("AV. PASEO DE LA CONSTITUCION No. 60", 40, 23);
  doc.text("Email: COMPRAS@IDPCC.COM.MX", 40, 27);
  doc.text("Tel: (722) 123-4567", 40, 31);

  // Info derecha (No. OC, Comprador, Fecha) en BLANCO
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("No. OC:", pageWidth - 60, 16);
  doc.text("Comprador:", pageWidth - 60, 22);
  doc.text("Fecha:", pageWidth - 60, 28);
  
  doc.setFont("helvetica", "normal");
  doc.text(order.orderNumber, pageWidth - 12, 16, { align: "right" });
  doc.text(order.buyer, pageWidth - 12, 22, { align: "right" });
  doc.text(new Date(order.createdDate).toLocaleDateString("es-MX"), pageWidth - 12, 28, { align: "right" });

  /* =====================================================
     OBRA - Primera sección con datos completos
     ===================================================== */
  let y = 44;

  // Borde más delgado (0.2mm)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setTextColor(0, 0, 0);
  doc.rect(10, y, pageWidth - 20, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Obra", 12, y + 4);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  
  // Columna izquierda - Datos de la obra
  doc.setFont("helvetica", "bold");
  doc.text("Nombre:", 12, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(order.workName, 28, y + 8);
  
  doc.setFont("helvetica", "bold");
  doc.text("No. Obra:", 12, y + 12);
  doc.setFont("helvetica", "normal");
  doc.text(order.workCode, 28, y + 12);
  
  // Residente de obra
  const workResident = order.workResident || "Por asignar";
  doc.setFont("helvetica", "bold");
  doc.text("Residente:", 12, y + 16);
  doc.setFont("helvetica", "normal");
  doc.text(workResident, 28, y + 16);

  // Columna derecha - Contacto y dirección
  const workPhone = order.workPhone || "N/A";
  doc.setFont("helvetica", "bold");
  doc.text("Teléfono:", 110, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(workPhone, 130, y + 8);
  
  // Dirección de la obra
  const workAddress = order.workAddress || order.client || "Dirección no especificada";
  doc.setFont("helvetica", "bold");
  doc.text("Dirección:", 110, y + 12);
  doc.setFont("helvetica", "normal");
  const addressLines = doc.splitTextToSize(workAddress, 70);
  doc.text(addressLines, 130, y + 12);

  /* =====================================================
     PROVEEDOR - Segunda sección con datos completos
     ===================================================== */
  y += 22;
  
  // Borde más delgado (0.2mm)
  doc.setLineWidth(0.2);
  doc.rect(10, y, pageWidth - 20, 20);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Proveedor", 12, y + 4);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  
  // Columna izquierda - Datos del proveedor
  const supplierName = order.supplierFullName || order.supplier;
  doc.setFont("helvetica", "bold");
  doc.text("Nombre:", 12, y + 8);
  doc.setFont("helvetica", "normal");
  const supplierNameLines = doc.splitTextToSize(supplierName, 80);
  doc.text(supplierNameLines, 28, y + 8);
  
  // Contacto del proveedor
  const supplierContact = order.supplierContact || "N/A";
  doc.setFont("helvetica", "bold");
  doc.text("Contacto:", 12, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(supplierContact, 28, y + 14);

  // Columna derecha - Cotización, Tipo, Fecha Entrega
  doc.setFont("helvetica", "bold");
  doc.text("Cotización:", 110, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text("N/A", 130, y + 8);
  
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Entrega:", 110, y + 12);
  doc.setFont("helvetica", "normal");
  doc.text(order.deliveryType === "Entrega" ? "En Obra" : "Recoger", 135, y + 12);
  
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Entrega:", 110, y + 16);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(order.deliveryDate).toLocaleDateString("es-MX"), 135, y + 16);
  
  // Dirección del proveedor si existe
  if (order.supplierAddress) {
    doc.setFont("helvetica", "bold");
    doc.text("Dirección:", 12, y + 18);
    doc.setFont("helvetica", "normal");
    const supplierAddressLines = doc.splitTextToSize(order.supplierAddress, 80);
    doc.text(supplierAddressLines, 28, y + 18);
  }

  /* =====================================================
     TABLA DE ITEMS - Bordes más oscuros y gruesos
     ===================================================== */
  y += 24;

  const tableData = order.items.map((item) => [
    item.quantity.toString(),
    item.unit || "Cub",
    item.description,
    `$ ${item.unitPrice.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    `$ ${item.total.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
  ]);

  // Rellenar hasta 15 renglones
  while (tableData.length < 15) {
    tableData.push(["", "", "", "", ""]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Cantidad", "Unidad", "Descripción", "P.U.", "Importe"]],
    body: tableData,
    theme: "grid",
    styles: { 
      fontSize: 8,
      cellPadding: 2,
      lineWidth: 0.5, // Bordes más gruesos
      lineColor: [0, 0, 0], // Negro
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineWidth: 0.6, // Bordes del header aún más gruesos
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      lineWidth: 0.5, // Bordes del cuerpo más gruesos
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 18, halign: "center" }, // Cantidad
      1: { cellWidth: 16, halign: "center" }, // Unidad
      2: { cellWidth: 100 }, // Descripción
      3: { cellWidth: 26, halign: "right" }, // P.U.
      4: { cellWidth: 30, halign: "right" }, // Importe
    },
    margin: { left: 10, right: 10 }, // Mismo margen que las secciones de arriba
    tableWidth: pageWidth - 20, // Ancho total = pageWidth - 20 (igual que Obra/Proveedor)
  });

  const afterTableY = (doc as any).lastAutoTable.finalY + 2;

  /* =====================================================
     TEXTO DE COMPROMISO
     ===================================================== */
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  const commitmentText = '"El proveedor se compromete a cumplir en tiempo, forma y en la ubicación solicitada los productos/servicios descritos en la presente Orden de Compra."';
  const commitmentLines = doc.splitTextToSize(commitmentText, pageWidth - 25);
  doc.text(commitmentLines, pageWidth / 2, afterTableY + 2, { align: "center" });

  /* =====================================================
     TOTALES
     ===================================================== */
  let totalsY = afterTableY + 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  doc.text("Subtotal", pageWidth - 50, totalsY);
  doc.text(`$ ${order.subtotal.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
  })}`, pageWidth - 12, totalsY, { align: "right" });

  doc.text("Otro", pageWidth - 50, totalsY + 5);
  doc.text("$ -", pageWidth - 12, totalsY + 5, { align: "right" });

  doc.text("IVA", pageWidth - 50, totalsY + 10);
  doc.text(`$ ${order.iva.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
  })}`, pageWidth - 12, totalsY + 10, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text("Total", pageWidth - 50, totalsY + 15);
  doc.text(`$ ${order.total.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
  })}`, pageWidth - 12, totalsY + 15, { align: "right" });

  /* =====================================================
     FIRMAS
     ===================================================== */
  const firmasY = totalsY + 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Columna 1: Elabora
  doc.text("Elabora", 40, firmasY, { align: "center" });
  doc.line(20, firmasY + 10, 60, firmasY + 10);
  doc.setFontSize(8);
  doc.text(order.buyer, 40, firmasY + 14, { align: "center" });

  // Columna 2: Autoriza
  doc.setFontSize(9);
  doc.text("Autoriza", pageWidth / 2, firmasY, { align: "center" });
  doc.line(pageWidth / 2 - 20, firmasY + 10, pageWidth / 2 + 20, firmasY + 10);
  doc.setFontSize(8);
  doc.text("Giovanni Martinez", pageWidth / 2, firmasY + 14, { align: "center" });

  // Columna 3: Proveedor
  doc.setFontSize(9);
  doc.text("Proveedor", pageWidth - 40, firmasY, { align: "center" });
  doc.line(pageWidth - 60, firmasY + 10, pageWidth - 20, firmasY + 10);
  doc.setFontSize(8);
  doc.text(order.supplier, pageWidth - 40, firmasY + 14, { align: "center" });

  /* =====================================================
     COMENTARIOS
     ===================================================== */
  const comentariosY = firmasY + 22;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(10, comentariosY, pageWidth - 20, 20);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Comentarios", pageWidth / 2, comentariosY + 5, { align: "center" });
  
  if (order.observations) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const commentsLines = doc.splitTextToSize(order.observations, pageWidth - 24);
    doc.text(commentsLines, 12, comentariosY + 10);
  }

  return doc;
}

/* =====================================================
   UTILIDAD: Convertir SVG a Data URL usando Canvas
   ===================================================== */
async function svgToDataURL(
  svgPath: string,
  width: number = 200,
  height: number = 200
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtener el SVG
      const response = await fetch(svgPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const svgText = await response.text();

      // Crear una imagen del SVG
      const img = new Image();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Crear canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("No se pudo crear el contexto del canvas"));
          return;
        }

        // Dibujar el SVG en el canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a Data URL
        const dataURL = canvas.toDataURL("image/png");

        // Limpiar
        URL.revokeObjectURL(url);

        resolve(dataURL);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Error al cargar el SVG"));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}