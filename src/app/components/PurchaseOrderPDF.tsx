import { PurchaseOrder } from "./PurchaseOrderForm";
import { worksDirectory } from "../utils/codeGenerators";
import { Button } from "./ui/button";
import { X, Download, Printer } from "lucide-react";
import { generatePurchaseOrderPDF } from "@/app/utils/generatePurchaseOrderPDF";
import { toast } from "sonner";

interface PurchaseOrderPDFProps {
  order: PurchaseOrder;
  onClose: () => void;
}

export function PurchaseOrderPDF({ order, onClose }: PurchaseOrderPDFProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      // Transformar los datos al formato esperado por el generador
      const pdfData = {
        orderNumber: order.orderNumber,
        createdDate: order.createdDate,
        workCode: order.workCode,
        workName: worksDirectory[order.workCode as keyof typeof worksDirectory]?.name || order.workCode,
        client: worksDirectory[order.workCode as keyof typeof worksDirectory]?.client,
        buyer: order.buyer,
        supplier: order.supplier,
        supplierFullName: order.supplier, // TODO: obtener nombre completo del proveedor
        deliveryType: order.deliveryType === "en_obra" ? "En Obra" : 
                     order.deliveryType === "bodega" ? "En Bodega" : "Recoger",
        deliveryDate: order.deliveryDate,
        items: order.items.map(item => ({
          quantity: item.quantity,
          unit: item.unit,
          description: item.description,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        subtotal: order.subtotal,
        iva: order.iva,
        total: order.total,
        observations: order.observations
      };

      const doc = await generatePurchaseOrderPDF(pdfData);
      doc.save(`OC-${order.orderNumber}.pdf`);
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  const workInfo = worksDirectory[order.workCode as keyof typeof worksDirectory];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header with actions */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 print:hidden">
          <h2 className="text-xl font-bold">Vista Previa - Orden de Compra</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-[210mm] mx-auto bg-white" id="pdf-content">
            {/* Document */}
            <div className="border-[3px] border-black">
              {/* Header Section */}
              <div className="flex border-b-[3px] border-black">
                {/* Logo Section - IDP Logo Amarillo */}
                <div className="w-28 border-r-[3px] border-black flex items-center justify-center bg-white p-2">
                  <img 
                    src="/logo-idp-alterno.svg" 
                    alt="IDP Logo" 
                    className="w-full h-24 object-contain"
                  />
                </div>

                {/* Company Info Section */}
                <div className="flex-1 bg-[#003B7A] text-white p-4 flex flex-col justify-center">
                  <h1 className="text-3xl font-black text-center mb-3 tracking-wide">ORDEN DE COMPRA</h1>
                  <div className="text-[11px] space-y-0.5 text-center">
                    <p className="font-bold">IDP CC SC DE RL DE CV</p>
                    <p>ICC110321LN0</p>
                    <p>AV. PASEO DE LA CONSTITUCION No. 60</p>
                    <p>COMPRAS@IDPCC.COM.MX</p>
                  </div>
                </div>

                {/* Order Number Section */}
                <div className="w-56 border-l-[3px] border-black">
                  <div className="p-2 border-b-2 border-black bg-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">No. O.C.</span>
                      <span className="font-semibold">{order.orderNumber}</span>
                    </div>
                  </div>
                  <div className="p-2 border-b-2 border-black bg-white">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">Comprador:</span>
                      <span>{order.buyer.split(" ")[0]}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">Fecha:</span>
                      <span>{new Date(order.createdDate).toLocaleDateString("es-MX")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Section */}
              <div className="flex border-b-[3px] border-black">
                <div className="w-28 border-r-[3px] border-black bg-gray-100 p-3 flex items-center justify-center">
                  <p className="text-sm font-bold text-center uppercase">Obra</p>
                </div>
                <div className="flex-1 p-3">
                  <p className="font-bold text-base mb-1">{workInfo?.name}</p>
                  <p className="text-xs text-gray-700">{workInfo?.resident}</p>
                  <p className="text-xs text-gray-600">{workInfo?.contractNumber}</p>
                </div>
                <div className="w-32 border-l-[3px] border-black bg-gray-100 p-2 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-bold uppercase mb-1">No. Obra</p>
                  <p className="text-4xl font-black">{order.workCode}</p>
                </div>
              </div>

              {/* Supplier Section */}
              <div className="flex border-b-[3px] border-black">
                <div className="w-28 border-r-[3px] border-black bg-gray-100 p-3 flex items-center justify-center">
                  <p className="text-sm font-bold text-center uppercase">Proveedor</p>
                </div>
                <div className="flex-1 p-3">
                  <p className="font-bold text-sm mb-1">{order.supplierFullName}</p>
                  <p className="text-xs text-gray-700 mb-2">{order.supplierAddress || "Dirección del proveedor"}</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    <div>
                      <span className="font-semibold">RFC: </span>
                      <span>{order.supplierRFC || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Tel: </span>
                      <span>{order.supplierPhone || "N/A"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">Contacto: </span>
                      <span>{order.supplierContact}</span>
                    </div>
                  </div>
                </div>
                <div className="w-64 border-l-[3px] border-black bg-gray-100 p-3">
                  <p className="text-xs font-bold uppercase mb-2">Datos Bancarios</p>
                  <div className="text-xs space-y-1 bg-white p-2 rounded">
                    <div>
                      <span className="font-semibold">Banco: </span>
                      <span>{order.supplierBank || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Cuenta: </span>
                      <span>{order.supplierAccount || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">CLABE: </span>
                      <span className="font-mono text-[10px]">{order.supplierCLABE || "N/A"}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-400">
                    <p className="text-xs font-bold mb-1">Entrega:</p>
                    <p className="text-sm font-semibold">
                      {new Date(order.deliveryDate).toLocaleDateString("es-MX")}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{order.deliveryType}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-b-[3px] border-black">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200 border-b-2 border-black">
                      <th className="border-r-2 border-black p-2 text-xs font-bold text-center w-20">
                        CANT.
                      </th>
                      <th className="border-r-2 border-black p-2 text-xs font-bold text-center w-20">
                        UNIDAD
                      </th>
                      <th className="border-r-2 border-black p-2 text-xs font-bold text-left">
                        DESCRIPCIÓN
                      </th>
                      <th className="border-r-2 border-black p-2 text-xs font-bold text-right w-28">
                        P. UNITARIO
                      </th>
                      <th className="p-2 text-xs font-bold text-right w-32">IMPORTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-400">
                        <td className="border-r border-gray-400 p-2 text-sm text-center">
                          {item.quantity.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border-r border-gray-400 p-2 text-sm text-center">
                          PZA
                        </td>
                        <td className="border-r border-gray-400 p-2 text-sm">
                          {item.description}
                        </td>
                        <td className="border-r border-gray-400 p-2 text-sm text-right font-mono">
                          ${" "}
                          {item.unitPrice.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-2 text-sm text-right font-mono font-semibold">
                          ${" "}
                          {item.total.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows */}
                    {Array.from({ length: Math.max(0, 12 - order.items.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-gray-300">
                        <td className="border-r border-gray-300 p-2 h-7">&nbsp;</td>
                        <td className="border-r border-gray-300 p-2">&nbsp;</td>
                        <td className="border-r border-gray-300 p-2">&nbsp;</td>
                        <td className="border-r border-gray-300 p-2">&nbsp;</td>
                        <td className="p-2">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Terms and Totals */}
              <div className="flex border-b-[3px] border-black">
                <div className="flex-1 p-4 border-r-[3px] border-black">
                  <p className="text-xs font-semibold mb-2 uppercase">Condiciones:</p>
                  <p className="text-xs italic text-justify leading-relaxed">
                    El proveedor se compromete a cumplir en tiempo, forma y en la ubicación
                    solicitada los productos/servicios descritos en la presente Orden de Compra.
                    Cualquier modificación deberá ser autorizada por escrito.
                  </p>
                </div>
                <div className="w-72 bg-gray-100">
                  <div className="flex justify-between p-2 border-b-2 border-black bg-white">
                    <span className="text-sm font-bold">SUBTOTAL:</span>
                    <span className="text-sm font-mono">
                      ${" "}
                      {order.subtotal.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between p-2 border-b-2 border-black bg-white">
                      <span className="text-sm font-bold">DESCUENTO:</span>
                      <span className="text-sm font-mono">
                        ${" "}
                        {order.discountAmount.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  {order.hasIVA && (
                    <div className="flex justify-between p-2 border-b-2 border-black bg-white">
                      <span className="text-sm font-bold">IVA (16%):</span>
                      <span className="text-sm font-mono">
                        ${" "}
                        {order.iva.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-3 bg-[#003B7A] text-white">
                    <span className="text-base font-black uppercase">TOTAL:</span>
                    <span className="text-lg font-black font-mono">
                      ${" "}
                      {order.total.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex border-b-[3px] border-black">
                <div className="flex-1 p-6 border-r-2 border-black text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-black pt-2">
                    <p className="text-xs font-bold uppercase mb-1">Elaboró</p>
                    <p className="text-sm">{order.buyer}</p>
                  </div>
                </div>
                <div className="flex-1 p-6 border-r-2 border-black text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-black pt-2">
                    <p className="text-xs font-bold uppercase mb-1">Autorizó</p>
                    <p className="text-sm">Giovanni Martínez</p>
                    <p className="text-xs text-gray-600">Director General</p>
                  </div>
                </div>
                <div className="flex-1 p-6 text-center">
                  <div className="h-16 mb-2"></div>
                  <div className="border-t-2 border-black pt-2">
                    <p className="text-xs font-bold uppercase mb-1">Aceptó Proveedor</p>
                    <p className="text-sm">{order.supplier}</p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {order.observations && (
                <div className="p-3 bg-yellow-50">
                  <p className="text-xs font-bold uppercase mb-1">Observaciones:</p>
                  <p className="text-xs">{order.observations}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-content,
          #pdf-content * {
            visibility: visible;
          }
          #pdf-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}