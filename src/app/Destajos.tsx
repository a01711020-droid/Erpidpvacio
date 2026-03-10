import React, { useState, useRef, useEffect } from "react";
import { ViewState } from "@/app/components/states";
import {
  DestajosStateLoading,
  DestajosStateEmpty,
  DestajosStateError,
} from "@/app/components/destajos";
import CatalogoImportExport from "@/app/components/CatalogoImportExport";
import CatalogoImporter from "@/app/components/CatalogoImporter";
import ResumenDestajosWithStates from "@/app/components/ResumenDestajosWithStates";
import { destajistasMock } from "/spec/destajos/destajistas.mock";
import { obrasMock } from "/spec/destajos/obras.mock";
import { resumenObrasMock } from "/spec/destajos/resumen.mock";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import {
  HardHat,
  ArrowLeft,
  Users,
  Edit,
  Trash2,
  Lock,
  Home,
  ChevronDown,
  ChevronUp,
  FileText,
  ClipboardList,
  Calculator,
  DollarSign,
  History,
  Save,
  FileSpreadsheet,
  Calendar,
  Download,
  RefreshCw,
  StickyNote,
  Plus,
  Maximize,
  Minimize,
} from "lucide-react";
import { generateDestajosPDF } from "@/app/utils/generateDestajosPDF";
import { generateRemisionPDF } from "@/app/utils/generateRemisionPDF";

interface Props {
  initialState?: ViewState;
  onBack: () => void;
  onManageDestajistas: () => void;
}

// Types
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

interface Destajista {
  id: string;
  nombre: string;
  iniciales: string;
  color: string;
  especialidad: string;
  telefono?: string;
}

interface HistoricoCaptura {
  semana: string;
  fecha: string;
  data: Record<string, string>;
}

interface Obra {
  id: string;
  nombre: string;
  codigo: string;
  totalLotes: number;
  totalPagado: number;
  pagadoSemana: number;
  lotes: Lote[];
  catalogoConceptos: Seccion[];
}

interface DetalleDestajista {
  concepto: string;
  codigo: string;
  lote: string;
  prototipo: string;
  monto: number;
  semana: string;
  fechaSemana?: string; // Semana del año o fecha de nota
  isNota?: boolean;
  isHistorico?: boolean;
}

interface HistoricoPago {
  semana: string;
  fecha: string;
  total: number;
}

interface NotaExterna {
  id: string;
  codigo: string;
  iniciales: string;
  nombre: string;
  concepto: string;
  monto: number;
  fecha?: string; // Fecha de la nota
  esHistorica?: boolean; // Si es nota histórica o semanal
}

// Mock Destajistas - convertir de spec a formato local
const mockDestajistas: Destajista[] = destajistasMock.map((d, index) => ({
  id: String(index + 1),
  nombre: d.nombre,
  iniciales: d.inicial,
  color: d.color,
  especialidad: d.especialidad,
}));

// Mock Data
const mockObras: Obra[] = [
  {
    id: "1",
    nombre: "CASTELLO F - Fraccionamiento Residencial Meseta",
    codigo: "228",
    totalLotes: 10,
    totalPagado: 3850000,
    pagadoSemana: 125000,
    lotes: [
      { numero: "LOTE_F1", prototipo: "88" },
      { numero: "LOTE_F2", prototipo: "88" },
      { numero: "LOTE_F3", prototipo: "88" },
      { numero: "LOTE_F4", prototipo: "78" },
      { numero: "LOTE_F5", prototipo: "78" },
      { numero: "LOTE_F6", prototipo: "78" },
      { numero: "LOTE_F7", prototipo: "78" },
      { numero: "LOTE_F8", prototipo: "78" },
      { numero: "LOTE_F9", prototipo: "70" },
      { numero: "LOTE_F10", prototipo: "70" },
    ],
    catalogoConceptos: [
      {
        nombre: "CIMENTACIÓN",
        conceptos: [
          {
            id: "c1",
            codigo: "CIM-001",
            nombre: "Trazo",
            precios: { prototipo70: 200.0, prototipo78: 200.0, prototipo88: 200.0 },
          },
          {
            id: "c2",
            codigo: "CIM-002",
            nombre: "Excavación manual",
            precios: { prototipo70: 1100.0, prototipo78: 1100.0, prototipo88: 1100.0 },
          },
          {
            id: "c3",
            codigo: "CIM-003",
            nombre: "Relleno fluido instalacion sanitaria",
            precios: { prototipo70: 600.0, prototipo78: 700.0, prototipo88: 800.0 },
          },
          {
            id: "c4",
            codigo: "CIM-004",
            nombre: "Plástico",
            precios: { prototipo70: 150.0, prototipo78: 150.0, prototipo88: 220.0 },
          },
          {
            id: "c5",
            codigo: "CIM-005",
            nombre: "Cimbra",
            precios: { prototipo70: 620.0, prototipo78: 700.0, prototipo88: 700.0 },
          },
          {
            id: "c6",
            codigo: "CIM-006",
            nombre: "Cimbra Dentellon",
            precios: { prototipo70: 250.0, prototipo78: 250.0, prototipo88: 250.0 },
          },
          {
            id: "c7",
            codigo: "CIM-007",
            nombre: "Acero (corte y habilitado)",
            precios: { prototipo70: 1000.0, prototipo78: 1300.0, prototipo88: 1500.0 },
          },
          {
            id: "c8",
            codigo: "CIM-008",
            nombre: "Acero (colocación)",
            precios: { prototipo70: 1000.0, prototipo78: 1300.0, prototipo88: 1500.0 },
          },
          {
            id: "c9",
            codigo: "CIM-009",
            nombre: "Acero dentellon",
            precios: { prototipo70: 150.0, prototipo78: 150.0, prototipo88: 150.0 },
          },
          {
            id: "c10",
            codigo: "CIM-010",
            nombre: "Colado y curado",
            precios: { prototipo70: 1200.0, prototipo78: 1350.0, prototipo88: 1700.0 },
          },
        ],
      },
      {
        nombre: "PLANTA BAJA",
        conceptos: [
          {
            id: "c11",
            codigo: "PB-001",
            nombre: "Trazo",
            precios: { prototipo70: 250.0, prototipo78: 250.0, prototipo88: 250.0 },
          },
          {
            id: "c12",
            codigo: "PB-002",
            nombre: "Muros, castillos ahogados y enrrases",
            precios: { prototipo70: 3450.0, prototipo78: 3500.0, prototipo88: 4000.0 },
          },
          {
            id: "c13",
            codigo: "PB-004",
            nombre: "Castillos (cimbra y colado)",
            precios: { prototipo70: 3300.0, prototipo78: 4200.0, prototipo88: 5500.0 },
          },
          {
            id: "c14",
            codigo: "PB-005",
            nombre: "Cerramientos (acero)",
            precios: { prototipo70: 300.0, prototipo78: 300.0, prototipo88: 300.0 },
          },
          {
            id: "c15",
            codigo: "PB-006",
            nombre: "Cerramientos (cimbra y colado)",
            precios: { prototipo70: 1000.0, prototipo78: 900.0, prototipo88: 800.0 },
          },
          {
            id: "c16",
            codigo: "PB-007",
            nombre: "Cadenas Intermedias",
            precios: { prototipo70: 100.0, prototipo78: 200.0, prototipo88: 200.0 },
          },
        ],
      },
      {
        nombre: "ESCALERA",
        conceptos: [
          {
            id: "c17",
            codigo: "ESC-001",
            nombre: "Escalera (cimbra)",
            precios: { prototipo70: 1200.0, prototipo78: 1200.0, prototipo88: 1200.0 },
          },
          {
            id: "c18",
            codigo: "ESC-002",
            nombre: "Escalera (Colado)",
            precios: { prototipo70: 300.0, prototipo78: 300.0, prototipo88: 300.0 },
          },
          {
            id: "c19",
            codigo: "ESC-003",
            nombre: "Escalera (acero)",
            precios: { prototipo70: 500.0, prototipo78: 500.0, prototipo88: 500.0 },
          },
        ],
      },
      {
        nombre: "ENTREPISO",
        conceptos: [
          {
            id: "c20",
            codigo: "ENT-001",
            nombre: "Cimbra perimetral y de fondo",
            precios: { prototipo70: 3000.0, prototipo78: 3300.0, prototipo88: 4600.0 },
          },
          {
            id: "c21",
            codigo: "ENT-002",
            nombre: "Acero + silletas (habilitado)",
            precios: { prototipo70: 1300.0, prototipo78: 1600.0, prototipo88: 2000.0 },
          },
          {
            id: "c22",
            codigo: "ENT-003",
            nombre: "Acero + silletas (colocación)",
            precios: { prototipo70: 1300.0, prototipo78: 1600.0, prototipo88: 2000.0 },
          },
          {
            id: "c23",
            codigo: "ENT-004",
            nombre: "Calafateo",
            precios: { prototipo70: 150.0, prototipo78: 150.0, prototipo88: 150.0 },
          },
          {
            id: "c24",
            codigo: "ENT-005",
            nombre: "Colado y curado",
            precios: { prototipo70: 1400.0, prototipo78: 1600.0, prototipo88: 2000.0 },
          },
        ],
      },
      {
        nombre: "PLANTA ALTA",
        conceptos: [
          {
            id: "c25",
            codigo: "PA-001",
            nombre: "Trazo",
            precios: { prototipo70: 250.0, prototipo78: 250.0, prototipo88: 250.0 },
          },
          {
            id: "c26",
            codigo: "PA-002",
            nombre: "Muros y castillos ahogados",
            precios: { prototipo70: 4750.0, prototipo78: 5600.0, prototipo88: 6850.0 },
          },
          {
            id: "c27",
            codigo: "PA-004",
            nombre: "Castillos (cimbra y colado)",
            precios: { prototipo70: 3200.0, prototipo78: 4200.0, prototipo88: 6000.0 },
          },
          {
            id: "c28",
            codigo: "PA-005",
            nombre: "Cerramientos (acero)",
            precios: { prototipo70: 300.0, prototipo78: 300.0, prototipo88: 300.0 },
          },
          {
            id: "c29",
            codigo: "PA-006",
            nombre: "Cerramientos (cimbra y colado)",
            precios: { prototipo70: 1200.0, prototipo78: 1300.0, prototipo88: 1500.0 },
          },
        ],
      },
      {
        nombre: "AZOTEA",
        conceptos: [
          {
            id: "c30",
            codigo: "AZ-001",
            nombre: "Cimbra perimetral y de fondo",
            precios: { prototipo70: 3000.0, prototipo78: 3300.0, prototipo88: 4600.0 },
          },
          {
            id: "c31",
            codigo: "AZ-002",
            nombre: "Acero + silletas (habilitado)",
            precios: { prototipo70: 1300.0, prototipo78: 1600.0, prototipo88: 2000.0 },
          },
          {
            id: "c32",
            codigo: "AZ-003",
            nombre: "Acero + silletas (colocación)",
            precios: { prototipo70: 1300.0, prototipo78: 1600.0, prototipo88: 2000.0 },
          },
        ],
      },
    ],
  },
  {
    id: "2",
    nombre: "CASTELLO G - Fraccionamiento Residencial Meseta",
    codigo: "229",
    totalLotes: 8,
    totalPagado: 2850000,
    pagadoSemana: 95000,
    lotes: [
      { numero: "LOTE_G1", prototipo: "88" },
      { numero: "LOTE_G2", prototipo: "88" },
      { numero: "LOTE_G3", prototipo: "78" },
      { numero: "LOTE_G4", prototipo: "78" },
      { numero: "LOTE_G5", prototipo: "78" },
      { numero: "LOTE_G6", prototipo: "78" },
      { numero: "LOTE_G7", prototipo: "70" },
      { numero: "LOTE_G8", prototipo: "70" },
    ],
    catalogoConceptos: [
      {
        nombre: "CIMENTACIÓN",
        conceptos: [
          {
            id: "c1",
            codigo: "CIM-001",
            nombre: "Trazo",
            precios: { prototipo70: 200.0, prototipo78: 200.0, prototipo88: 200.0 },
          },
          {
            id: "c2",
            codigo: "CIM-002",
            nombre: "Excavación manual",
            precios: { prototipo70: 1100.0, prototipo78: 1100.0, prototipo88: 1100.0 },
          },
          {
            id: "c3",
            codigo: "CIM-003",
            nombre: "Relleno fluido instalacion sanitaria",
            precios: { prototipo70: 600.0, prototipo78: 700.0, prototipo88: 800.0 },
          },
        ],
      },
      {
        nombre: "PLANTA BAJA",
        conceptos: [
          {
            id: "c11",
            codigo: "PB-001",
            nombre: "Trazo",
            precios: { prototipo70: 250.0, prototipo78: 250.0, prototipo88: 250.0 },
          },
          {
            id: "c12",
            codigo: "PB-002",
            nombre: "Muros, castillos ahogados y enrrases",
            precios: { prototipo70: 3450.0, prototipo78: 3500.0, prototipo88: 4000.0 },
          },
        ],
      },
    ],
  },
  {
    id: "3",
    nombre: "CASTELLO H - Fraccionamiento Residencial Meseta",
    codigo: "230",
    totalLotes: 12,
    totalPagado: 4250000,
    pagadoSemana: 145000,
    lotes: [
      { numero: "LOTE_H1", prototipo: "88" },
      { numero: "LOTE_H2", prototipo: "88" },
      { numero: "LOTE_H3", prototipo: "88" },
      { numero: "LOTE_H4", prototipo: "78" },
      { numero: "LOTE_H5", prototipo: "78" },
      { numero: "LOTE_H6", prototipo: "78" },
      { numero: "LOTE_H7", prototipo: "78" },
      { numero: "LOTE_H8", prototipo: "78" },
      { numero: "LOTE_H9", prototipo: "70" },
      { numero: "LOTE_H10", prototipo: "70" },
      { numero: "LOTE_H11", prototipo: "70" },
      { numero: "LOTE_H12", prototipo: "70" },
    ],
    catalogoConceptos: [
      {
        nombre: "CIMENTACIÓN",
        conceptos: [
          {
            id: "c1",
            codigo: "CIM-001",
            nombre: "Trazo",
            precios: { prototipo70: 200.0, prototipo78: 200.0, prototipo88: 200.0 },
          },
          {
            id: "c2",
            codigo: "CIM-002",
            nombre: "Excavación manual",
            precios: { prototipo70: 1100.0, prototipo78: 1100.0, prototipo88: 1100.0 },
          },
        ],
      },
    ],
  },
  {
    id: "4",
    nombre: "DOZA A - Fraccionamiento Residencial Mayorazgo",
    codigo: "231",
    totalLotes: 15,
    totalPagado: 5120000,
    pagadoSemana: 180000,
    lotes: [
      { numero: "DOZA_A1", prototipo: "88" },
      { numero: "DOZA_A2", prototipo: "88" },
      { numero: "DOZA_A3", prototipo: "88" },
      { numero: "DOZA_A4", prototipo: "88" },
      { numero: "DOZA_A5", prototipo: "78" },
      { numero: "DOZA_A6", prototipo: "78" },
      { numero: "DOZA_A7", prototipo: "78" },
      { numero: "DOZA_A8", prototipo: "78" },
      { numero: "DOZA_A9", prototipo: "78" },
      { numero: "DOZA_A10", prototipo: "70" },
      { numero: "DOZA_A11", prototipo: "70" },
      { numero: "DOZA_A12", prototipo: "70" },
      { numero: "DOZA_A13", prototipo: "70" },
      { numero: "DOZA_A14", prototipo: "70" },
      { numero: "DOZA_A15", prototipo: "70" },
    ],
    catalogoConceptos: [
      {
        nombre: "CIMENTACIÓN",
        conceptos: [
          {
            id: "c1",
            codigo: "CIM-001",
            nombre: "Trazo",
            precios: { prototipo70: 200.0, prototipo78: 200.0, prototipo88: 200.0 },
          },
          {
            id: "c2",
            codigo: "CIM-002",
            nombre: "Excavación manual",
            precios: { prototipo70: 1100.0, prototipo78: 1100.0, prototipo88: 1100.0 },
          },
        ],
      },
    ],
  },
  {
    id: "5",
    nombre: "BALVANERA - LOTE 25 ETAPA FRACC. PRIVADA PALERMO",
    codigo: "232",
    totalLotes: 18,
    totalPagado: 6350000,
    pagadoSemana: 220000,
    lotes: [
      { numero: "BALV_L1", prototipo: "88" },
      { numero: "BALV_L2", prototipo: "88" },
      { numero: "BALV_L3", prototipo: "88" },
      { numero: "BALV_L4", prototipo: "88" },
      { numero: "BALV_L5", prototipo: "88" },
      { numero: "BALV_L6", prototipo: "88" },
      { numero: "BALV_L7", prototipo: "78" },
      { numero: "BALV_L8", prototipo: "78" },
      { numero: "BALV_L9", prototipo: "78" },
      { numero: "BALV_L10", prototipo: "78" },
      { numero: "BALV_L11", prototipo: "78" },
      { numero: "BALV_L12", prototipo: "78" },
      { numero: "BALV_L13", prototipo: "70" },
      { numero: "BALV_L14", prototipo: "70" },
      { numero: "BALV_L15", prototipo: "70" },
      { numero: "BALV_L16", prototipo: "70" },
      { numero: "BALV_L17", prototipo: "70" },
      { numero: "BALV_L18", prototipo: "70" },
    ],
    catalogoConceptos: [
      {
        nombre: "CIMENTACIÓN",
        conceptos: [
          {
            id: "c1",
            codigo: "CIM-001",
            nombre: "Trazo",
            precios: { prototipo70: 200.0, prototipo78: 200.0, prototipo88: 200.0 },
          },
          {
            id: "c2",
            codigo: "CIM-002",
            nombre: "Excavación manual",
            precios: { prototipo70: 1100.0, prototipo78: 1100.0, prototipo88: 1100.0 },
          },
        ],
      },
    ],
  },
  {
    id: "6",
    nombre: "DOZA C - Fraccionamiento Residencial Mayorazgo",
    codigo: "233",
    totalLotes: 12,
    totalPagado: 4800000,
    pagadoSemana: 160000,
    lotes: [
      { numero: "DOZA_C1", prototipo: "88" },
      { numero: "DOZA_C2", prototipo: "88" },
      { numero: "DOZA_C3", prototipo: "88" },
      { numero: "DOZA_C4", prototipo: "78" },
      { numero: "DOZA_C5", prototipo: "78" },
      { numero: "DOZA_C6", prototipo: "78" },
      { numero: "DOZA_C7", prototipo: "78" },
      { numero: "DOZA_C8", prototipo: "78" },
      { numero: "DOZA_C9", prototipo: "70" },
      { numero: "DOZA_C10", prototipo: "70" },
      { numero: "DOZA_C11", prototipo: "70" },
      { numero: "DOZA_C12", prototipo: "70" },
    ],
    catalogoConceptos: [
      {
        nombre: "CIMENTACIÓN",
        conceptos: [
          {
            id: "c1",
            codigo: "CIM-001",
            nombre: "Trazo",
            precios: { prototipo70: 200.0, prototipo78: 200.0, prototipo88: 200.0 },
          },
          {
            id: "c2",
            codigo: "CIM-002",
            nombre: "Excavación manual",
            precios: { prototipo70: 1100.0, prototipo78: 1100.0, prototipo88: 1100.0 },
          },
        ],
      },
    ],
  },
];

// Mock Data - Resumen de Obras para ResumenDestajos (importado desde spec)
const obrasResumen = resumenObrasMock;

export default function Destajos({
  initialState = "data",
  onBack,
  onManageDestajistas,
}: Props) {
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [currentView, setCurrentView] = useState<"obras" | "resumen">("obras");
  const [lotesOpen, setLotesOpen] = useState(false);

  // Edit states
  const [editingCatalogo, setEditingCatalogo] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [editingLotes, setEditingLotes] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Captura state - store iniciales per concepto/lote (SEMANA ACTUAL)
  const [capturaData, setCapturaData] = useState<Record<string, string>>({
    // Mock data semana actual
    "c1-23_A": "JP",
    "c2-23_A": "MG",
    "c1-23_B": "CR",
    "c3-11_E": "JP",
    "c12-11_D": "MG",
    "c13-23_D": "CR",
  });
  
  // Históricos (semanas pasadas) - bloqueadas
  const [historicos, setHistoricos] = useState<HistoricoCaptura[]>([
    {
      semana: "Semana 1",
      fecha: "2025-01-06",
      data: {
        "c1-23_C": "JP",
        "c2-23_B": "MG",
        "c4-11_D": "CR",
        "c5-11_C": "JP",
        "c6-23_D": "MG",
      },
    },
    {
      semana: "Semana 2",
      fecha: "2025-01-13",
      data: {
        "c7-23_E": "JP",
        "c8-24_A": "CR",
        "c9-24_B": "MG",
        "c11-11_E": "JP",
      },
    },
  ]);
  
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [selectedDestajista, setSelectedDestajista] = useState<string | null>(null);
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());

  // Estado para toggle de vista en resumen de pagos
  const [vistaResumen, setVistaResumen] = useState<"actuales" | "historicos" | "notas">("actuales");

  // Notas externas
  const [notas, setNotas] = useState<NotaExterna[]>([
    {
      id: "n1",
      codigo: "EXT-001",
      iniciales: "JP",
      nombre: "Juan Pérez",
      concepto: "Ajuste por material adicional",
      monto: 500,
      fecha: "2025-02-05",
      esHistorica: false, // Nota semanal
    },
    {
      id: "n2",
      codigo: "EXT-002",
      iniciales: "MG",
      nombre: "María González",
      concepto: "Descuento por error anterior",
      monto: -300,
      fecha: "2025-02-06",
      esHistorica: false, // Nota semanal
    },
    {
      id: "n3",
      codigo: "EXT-003",
      iniciales: "CR",
      nombre: "Carlos Ramírez",
      concepto: "Bonificación semana anterior",
      monto: 1200,
      fecha: "2025-01-28",
      esHistorica: true, // Nota histórica
    },
  ]);
  const [showNotasDialog, setShowNotasDialog] = useState(false);
  const [notaForm, setNotaForm] = useState({
    iniciales: "",
    concepto: "",
    monto: "",
  });

  // Handlers
  const handleRetry = () => {
    setViewState("loading");
    setTimeout(() => setViewState("data"), 1000);
  };

  const handleCreateWork = () => {
    // Las obras se crean desde el Dashboard General — redirigir
    import("sonner").then(({ toast }) => {
      toast.info("Las obras se gestionan desde el Dashboard General. Regresa al menú principal para crear una nueva obra.", { duration: 5000 });
    });
    onBack();
  };

  const handleSelectObra = (obra: Obra) => {
    setSelectedObra(obra);
  };

  const handleBackToList = () => {
    setSelectedObra(null);
    setEditingCatalogo(false);
    setEditingLotes(false);
    setSelectedDestajista(null);
  };

  const handleEditCatalogo = () => {
    setShowPasswordDialog(true);
  };

  const handlePasswordSubmit = () => {
    if (password === "12345") {
      setEditingCatalogo(true);
      setShowPasswordDialog(false);
      setPassword("");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleCapturaChange = (key: string, value: string) => {
    setCapturaData({ ...capturaData, [key]: value });
  };

  const validateCell = (key: string, value: string) => {
    const isValid = !value || mockDestajistas.some((d) => d.iniciales === value);
    if (!isValid) {
      alert(`Error: "${value}" no es un destajista válido.\n\nDestajistas disponibles:\n${mockDestajistas.map(d => `${d.iniciales} - ${d.nombre}`).join('\n')}`);
      setInvalidCells(prev => new Set(prev).add(key));
      return false;
    }
    setInvalidCells(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentKey: string) => {
    if (!selectedObra) return;
    
    // Solo validar si es tecla de navegación (no letras/números)
    const isNavigationKey = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter', 'Tab'].includes(e.key);
    
    if (isNavigationKey) {
      // Validar celda actual antes de moverse
      const currentValue = getCellValue(currentKey);
      if (currentValue && !isHistorico(currentKey)) {
        if (!validateCell(currentKey, currentValue)) {
          e.preventDefault();
          return;
        }
      }
    }
    
    const allKeys: string[] = [];
    selectedObra.catalogoConceptos.forEach((seccion) => {
      seccion.conceptos.forEach((concepto) => {
        selectedObra.lotes.forEach((lote) => {
          allKeys.push(`${concepto.id}-${lote.numero}`);
        });
      });
    });

    const currentIndex = allKeys.indexOf(currentKey);
    if (currentIndex === -1) return;

    const numLotes = selectedObra.lotes.length;
    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowRight":
        nextIndex = currentIndex + 1;
        e.preventDefault();
        break;
      case "ArrowLeft":
        nextIndex = currentIndex - 1;
        e.preventDefault();
        break;
      case "ArrowDown":
        nextIndex = currentIndex + numLotes;
        e.preventDefault();
        break;
      case "ArrowUp":
        nextIndex = currentIndex - numLotes;
        e.preventDefault();
        break;
      case "Enter":
        nextIndex = currentIndex + numLotes;
        e.preventDefault();
        break;
      case "Tab":
        nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
        e.preventDefault();
        break;
    }

    if (nextIndex >= 0 && nextIndex < allKeys.length) {
      const nextKey = allKeys[nextIndex];
      setFocusedCell(nextKey);
      setTimeout(() => {
        const nextCell = document.getElementById(`cell-${nextKey}`);
        if (nextCell) {
          nextCell.focus();
        }
      }, 0);
    }
  };

  const getDestajistaColor = (iniciales: string): string => {
    const destajista = mockDestajistas.find((d) => d.iniciales === iniciales);
    return destajista ? destajista.color : "#fbbf24"; // amarillo para texto inválido
  };

  const isHistorico = (key: string): boolean => {
    return historicos.some((h) => h.data[key]);
  };

  const getCellValue = (key: string): string => {
    // Primero buscar en históricos
    for (const hist of historicos) {
      if (hist.data[key]) return hist.data[key];
    }
    // Luego en captura actual
    return capturaData[key] || "";
  };

  const handleSaveWeek = () => {
    const now = new Date();
    const weekNum = historicos.length + 3;
    const newHistorico: HistoricoCaptura = {
      semana: `Semana ${weekNum}`,
      fecha: now.toISOString().split("T")[0],
      data: { ...capturaData },
    };
    setHistoricos([...historicos, newHistorico]);
    setCapturaData({});
    alert(`Semana ${weekNum} guardada. Las capturas son ahora históricos (gris y bloqueadas).`);
  };

  const handleRecalcular = () => {
    alert("Recalculando destajos...");
    // Aquí se podría forzar un re-render o actualizar cálculos
  };

  const handleAddNota = () => {
    if (!notaForm.iniciales || !notaForm.concepto || !notaForm.monto) {
      alert("Por favor completa todos los campos");
      return;
    }

    const destajista = mockDestajistas.find((d) => d.iniciales === notaForm.iniciales);
    if (!destajista) {
      alert("Destajista no encontrado");
      return;
    }

    const nextNotaNum = notas.length + 1;
    const newNota: NotaExterna = {
      id: `n${nextNotaNum}`,
      codigo: `EXT-${String(nextNotaNum).padStart(3, "0")}`,
      iniciales: notaForm.iniciales,
      nombre: destajista.nombre,
      concepto: notaForm.concepto,
      monto: parseFloat(notaForm.monto),
    };

    setNotas([...notas, newNota]);
    setNotaForm({ iniciales: "", concepto: "", monto: "" });
    setShowNotasDialog(false);
    alert(`Nota ${newNota.codigo} agregada correctamente`);
  };

  const handleInicialesChange = (iniciales: string) => {
    setNotaForm({
      ...notaForm,
      iniciales,
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleExportPDF = () => {
    if (!selectedObra) return;
    
    try {
      generateDestajosPDF(selectedObra, capturaData, historicos, mockDestajistas);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
    }
  };

  // Listener para tecla 'F11' para pantalla completa
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F11 para pantalla completa
      if (e.key === 'F11' && selectedObra && !selectedDestajista) {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, selectedObra, selectedDestajista]);

  // Helper: Obtener semana del año
  const getSemanaDelAno = (): string => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const weekNumber = Math.ceil(diff / oneWeek);
    return `S${weekNumber}`;
  };

  // Calcular montos - SOLO SEMANA ACTUAL + NOTAS
  const calculateCurrentWeekPayments = () => {
    if (!selectedObra) return {};

    const payments: Record<string, { nombre: string; total: number; detalles: DetalleDestajista[] }> = {};

    // Inicializar destajistas
    mockDestajistas.forEach((d) => {
      payments[d.iniciales] = { nombre: d.nombre, total: 0, detalles: [] };
    });

    // Procesar SOLO captura actual (semana actual)
    Object.entries(capturaData).forEach(([key, iniciales]) => {
      if (!iniciales) return;

      const [conceptoId, loteNumero] = key.split("-");
      
      let concepto: Concepto | null = null;
      let codigo = "";
      for (const seccion of selectedObra.catalogoConceptos) {
        const found = seccion.conceptos.find((c) => c.id === conceptoId);
        if (found) {
          concepto = found;
          codigo = found.codigo;
          break;
        }
      }
      
      const lote = selectedObra.lotes.find((l) => l.numero === loteNumero);
      
      if (!concepto || !lote) return;

      let precio = 0;
      const proto = lote.prototipo.toLowerCase();
      
      if (proto === "88") {
        precio = concepto.precios.prototipo88;
      } else if (proto === "78") {
        precio = concepto.precios.prototipo78;
      } else if (proto === "70") {
        precio = concepto.precios.prototipo70;
      } else {
        precio = concepto.precios.prototipo88;
      }

      if (!payments[iniciales]) {
        const dest = mockDestajistas.find((d) => d.iniciales === iniciales);
        payments[iniciales] = { nombre: dest?.nombre || iniciales, total: 0, detalles: [] };
      }

      payments[iniciales].total += precio;
      payments[iniciales].detalles.push({
        concepto: concepto.nombre,
        codigo: codigo,
        lote: lote.numero.replace(/_/g, " "),
        prototipo: lote.prototipo,
        monto: precio,
        semana: "Semana Actual",
        fechaSemana: getSemanaDelAno(), // Semana del año
        isNota: false,
        isHistorico: false,
      });
    });

    // Procesar SOLO notas semanales (no históricas)
    notas.forEach((nota) => {
      if (nota.esHistorica) return; // Saltar notas históricas
      
      if (!payments[nota.iniciales]) {
        payments[nota.iniciales] = { nombre: nota.nombre, total: 0, detalles: [] };
      }

      payments[nota.iniciales].total += nota.monto;
      payments[nota.iniciales].detalles.push({
        concepto: nota.concepto,
        codigo: nota.codigo,
        lote: "-",
        prototipo: "-",
        monto: nota.monto,
        semana: "Nota Semanal",
        fechaSemana: nota.fecha || new Date().toISOString().split('T')[0], // Fecha de la nota
        isNota: true,
        isHistorico: false,
      });
    });

    return payments;
  };

  // Calcular todos los detalles para la remisión (actual + históricos)
  const calculateAllPayments = () => {
    if (!selectedObra) return {};

    const payments: Record<string, { nombre: string; total: number; detalles: DetalleDestajista[] }> = {};

    mockDestajistas.forEach((d) => {
      payments[d.iniciales] = { nombre: d.nombre, total: 0, detalles: [] };
    });

    const processData = (data: Record<string, string>, semana: string) => {
      Object.entries(data).forEach(([key, iniciales]) => {
        if (!iniciales) return;

        const [conceptoId, loteNumero] = key.split("-");
        
        let concepto: Concepto | null = null;
        let codigo = "";
        for (const seccion of selectedObra.catalogoConceptos) {
          const found = seccion.conceptos.find((c) => c.id === conceptoId);
          if (found) {
            concepto = found;
            codigo = found.codigo;
            break;
          }
        }
        
        const lote = selectedObra.lotes.find((l) => l.numero === loteNumero);
        
        if (!concepto || !lote) return;

        let precio = 0;
        const proto = lote.prototipo.toLowerCase();
        
        if (proto === "88") {
          precio = concepto.precios.prototipo88;
        } else if (proto === "78") {
          precio = concepto.precios.prototipo78;
        } else if (proto === "70") {
          precio = concepto.precios.prototipo70;
        } else {
          precio = concepto.precios.prototipo88;
        }

        if (!payments[iniciales]) {
          const dest = mockDestajistas.find((d) => d.iniciales === iniciales);
          payments[iniciales] = { nombre: dest?.nombre || iniciales, total: 0, detalles: [] };
        }

        payments[iniciales].total += precio;
        payments[iniciales].detalles.push({
          concepto: concepto.nombre,
          codigo: codigo,
          lote: lote.numero.replace(/_/g, " "),
          prototipo: lote.prototipo,
          monto: precio,
          semana: semana,
        });
      });
    };

    // Procesar históricos
    historicos.forEach((hist) => {
      processData(hist.data, hist.semana);
    });

    // Procesar captura actual
    processData(capturaData, "Semana Actual");

    // Procesar notas (solo en remisión)
    notas.forEach((nota) => {
      if (!payments[nota.iniciales]) {
        payments[nota.iniciales] = { nombre: nota.nombre, total: 0, detalles: [] };
      }

      payments[nota.iniciales].total += nota.monto;
      payments[nota.iniciales].detalles.push({
        concepto: nota.concepto,
        codigo: nota.codigo,
        lote: "-",
        prototipo: "-",
        monto: nota.monto,
        semana: "Nota Externa",
      });
    });

    return payments;
  };

  // Calcular SOLO históricos
  const calculateHistoricPayments = () => {
    if (!selectedObra) return {};

    const payments: Record<string, { nombre: string; total: number; detalles: DetalleDestajista[] }> = {};

    mockDestajistas.forEach((d) => {
      payments[d.iniciales] = { nombre: d.nombre, total: 0, detalles: [] };
    });

    const processData = (data: Record<string, string>, semana: string, fecha: string) => {
      Object.entries(data).forEach(([key, iniciales]) => {
        if (!iniciales) return;

        const [conceptoId, loteNumero] = key.split("-");
        
        let concepto: Concepto | null = null;
        let codigo = "";
        for (const seccion of selectedObra.catalogoConceptos) {
          const found = seccion.conceptos.find((c) => c.id === conceptoId);
          if (found) {
            concepto = found;
            codigo = found.codigo;
            break;
          }
        }
        
        const lote = selectedObra.lotes.find((l) => l.numero === loteNumero);
        
        if (!concepto || !lote) return;

        let precio = 0;
        const proto = lote.prototipo.toLowerCase();
        
        if (proto === "88") {
          precio = concepto.precios.prototipo88;
        } else if (proto === "78") {
          precio = concepto.precios.prototipo78;
        } else if (proto === "70") {
          precio = concepto.precios.prototipo70;
        } else {
          precio = concepto.precios.prototipo88;
        }

        if (!payments[iniciales]) {
          const dest = mockDestajistas.find((d) => d.iniciales === iniciales);
          payments[iniciales] = { nombre: dest?.nombre || iniciales, total: 0, detalles: [] };
        }

        payments[iniciales].total += precio;
        payments[iniciales].detalles.push({
          concepto: concepto.nombre,
          codigo: codigo,
          lote: lote.numero.replace(/_/g, " "),
          prototipo: lote.prototipo,
          monto: precio,
          semana: semana,
          fechaSemana: fecha,
          isNota: false,
          isHistorico: true,
        });
      });
    };

    // Procesar SOLO históricos
    historicos.forEach((hist) => {
      processData(hist.data, hist.semana, hist.fecha);
    });

    // Procesar notas históricas
    notas.forEach((nota) => {
      if (!nota.esHistorica) return; // Solo notas históricas
      
      if (!payments[nota.iniciales]) {
        payments[nota.iniciales] = { nombre: nota.nombre, total: 0, detalles: [] };
      }

      payments[nota.iniciales].total += nota.monto;
      payments[nota.iniciales].detalles.push({
        concepto: nota.concepto,
        codigo: nota.codigo,
        lote: "-",
        prototipo: "-",
        monto: nota.monto,
        semana: "Nota Histórica",
        fechaSemana: nota.fecha || "",
        isNota: true,
        isHistorico: true,
      });
    });

    return payments;
  };

  // Calcular SOLO notas semanales
  const calculateOnlyNotasPayments = () => {
    if (!selectedObra) return {};

    const payments: Record<string, { nombre: string; total: number; detalles: DetalleDestajista[] }> = {};

    mockDestajistas.forEach((d) => {
      payments[d.iniciales] = { nombre: d.nombre, total: 0, detalles: [] };
    });

    // Procesar SOLO notas semanales (no históricas)
    notas.forEach((nota) => {
      if (nota.esHistorica) return; // Saltar notas históricas
      
      if (!payments[nota.iniciales]) {
        payments[nota.iniciales] = { nombre: nota.nombre, total: 0, detalles: [] };
      }

      payments[nota.iniciales].total += nota.monto;
      payments[nota.iniciales].detalles.push({
        concepto: nota.concepto,
        codigo: nota.codigo,
        lote: "-",
        prototipo: "-",
        monto: nota.monto,
        semana: "Nota Semanal",
        fechaSemana: nota.fecha || new Date().toISOString().split('T')[0],
        isNota: true,
        isHistorico: false,
      });
    });

    return payments;
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <DestajosStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <DestajosStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return (
      <DestajosStateEmpty
        onCreateWork={handleCreateWork}
        onManageDestajistas={onManageDestajistas}
        onBack={onBack}
      />
    );
  }

  // ESTADO: DATA - Vista de Remisión Individual (Imagen 3)
  if (selectedDestajista) {
    const allPayments = calculateAllPayments();
    const destajistaData = allPayments[selectedDestajista];
    const destajista = mockDestajistas.find((d) => d.iniciales === selectedDestajista);

    // Generar código de remisión: Iniciales|numero de obra|S|numero de semana del año
    const weekNumber = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));
    const obraNumero = selectedObra?.codigo.split('-')[1] || '001';
    const codigoRemision = `${selectedDestajista}${obraNumero}S${weekNumber}`;

    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)",
        }}
      >
        {/* Header simplificado */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-xl">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedDestajista(null)}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Button>
              <Button
                onClick={() => {
                  if (selectedObra && destajista && destajistaData) {
                    try {
                      generateRemisionPDF(
                        selectedObra,
                        destajista,
                        destajistaData.detalles,
                        destajistaData.total
                      );
                    } catch (error) {
                      console.error("Error al generar PDF de remisión:", error);
                      alert("Error al generar el PDF. Por favor, intente nuevamente.");
                    }
                  }
                }}
                className="bg-blue-700 hover:bg-blue-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Content - Remisión */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Título encima de la tabla */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-slate-900">
              {selectedObra?.codigo} - {selectedObra?.nombre}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {new Date().toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <div className="p-8">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-800">
                      <TableHead className="text-white font-bold text-center w-16 border-l-0">No.</TableHead>
                      <TableHead className="text-white font-bold text-center w-20">Iniciales</TableHead>
                      <TableHead className="text-white font-bold text-center w-28">Clave</TableHead>
                      <TableHead className="text-white font-bold text-center w-28">Prototipo</TableHead>
                      <TableHead className="text-white font-bold text-center w-24">Lote</TableHead>
                      <TableHead className="text-white font-bold">Concepto</TableHead>
                      <TableHead className="text-white font-bold text-right w-32 border-r-0">Importe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {destajistaData?.detalles.map((detalle, idx) => {
                      const isNota = detalle.semana === "Nota Externa";
                      return (
                        <TableRow 
                          key={idx} 
                          className={`border-b border-gray-300 ${isNota ? "bg-yellow-50" : ""}`}
                        >
                          <TableCell className="text-center font-semibold border-l-0">{idx + 1}</TableCell>
                          <TableCell className="text-center">
                            <div
                              className="w-10 h-10 mx-auto rounded flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: destajista?.color }}
                            >
                              {selectedDestajista}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm font-semibold">
                            {detalle.codigo}
                            {isNota && (
                              <StickyNote className="h-3 w-3 inline ml-1 text-yellow-600" />
                            )}
                          </TableCell>
                          <TableCell className="text-center font-bold text-slate-800">
                            {detalle.prototipo}
                          </TableCell>
                          <TableCell className="text-center font-semibold">{detalle.lote}</TableCell>
                          <TableCell>{detalle.concepto}</TableCell>
                          <TableCell className={`text-right font-bold text-lg border-r-0 ${detalle.monto < 0 ? "text-red-600" : ""}`}>
                            ${detalle.monto.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {/* Subtotal con código de remisión */}
                    <TableRow className="bg-slate-800">
                      <TableCell colSpan={6} className="text-left text-white font-bold text-lg pl-6 border-l-0">
                        {codigoRemision}
                      </TableCell>
                      <TableCell className="text-right text-white font-bold text-2xl border-r-0">
                        ${destajistaData?.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ESTADO: DATA - Vista de Obra Individual
  if (selectedObra) {
    const currentWeekPayments = calculateCurrentWeekPayments();
    const historicPayments = calculateHistoricPayments();
    const notasPayments = calculateOnlyNotasPayments();
    
    // Seleccionar datos según la vista activa
    const activePayments = vistaResumen === "historicos" ? historicPayments : 
                          vistaResumen === "notas" ? notasPayments : 
                          currentWeekPayments;
    
    // Preparar datos para tabla detallada
    const allCurrentWeekDetails: Array<{
      iniciales: string;
      nombre: string;
      codigo: string;
      concepto: string;
      prototipo: string;
      lote: string;
      importe: number;
      isNota: boolean;
      isHistorico: boolean;
      fechaSemana: string;
    }> = [];

    Object.entries(activePayments).forEach(([iniciales, data]) => {
      data.detalles.forEach((det) => {
        allCurrentWeekDetails.push({
          iniciales,
          nombre: data.nombre,
          codigo: det.codigo,
          concepto: det.concepto,
          prototipo: det.prototipo,
          lote: det.lote,
          importe: det.monto,
          isNota: det.isNota || false,
          isHistorico: det.isHistorico || false,
          fechaSemana: det.fechaSemana || "",
        });
      });
    });

    // Ordenar por destajista
    allCurrentWeekDetails.sort((a, b) => a.iniciales.localeCompare(b.iniciales));

    // Componente de la tabla de captura
    const CapturaTable = () => (
      <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-white" : "w-full h-[calc(100vh-280px)]"}`}>
        {isFullscreen && (
          <div className="bg-teal-800 text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Captura Semanal - {selectedObra.nombre}</h2>
            <Button onClick={toggleFullscreen} variant="ghost" className="text-white hover:bg-white/10">
              <Minimize className="h-5 w-5 mr-2" />
              Salir de Pantalla Completa
            </Button>
          </div>
        )}
        
        <div className={`${isFullscreen ? "p-4" : ""}`}>
          {!isFullscreen && (
            <div className="mb-3 px-2 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-teal-800 mb-1">
                  Captura Semanal de Avances - {selectedObra.nombre}
                </h2>
                <p className="text-xs text-gray-600 font-semibold">
                  Celdas de <span className="font-bold">color</span> = Semana actual (editable) | 
                  Celdas <span className="font-bold text-gray-500">grises</span> = Históricos (bloqueadas)
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button onClick={handleSaveWeek} className="bg-green-700 hover:bg-green-800">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Semana
                </Button>
                <Button onClick={handleExportPDF} className="bg-blue-700 hover:bg-blue-800">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          )}

          <div className={`overflow-auto border-4 border-gray-700 shadow-lg ${isFullscreen ? "h-[calc(100vh-120px)]" : "h-[calc(100%-80px)]"}`}>
            <table className="w-full border-collapse text-[11px]">
              <thead className="sticky top-0 z-30">
                {/* Fila 1: Nombre de Obra + Lotes - SIN BORDES */}
                <tr className="bg-[#3a3a3a]">
                  <th 
                    colSpan={2} 
                    className="sticky left-0 z-40 bg-[#3a3a3a] px-3 py-2 text-white font-bold text-sm border-0"
                  >
                    {selectedObra.nombre}
                  </th>
                  {selectedObra.lotes.map((lote, idx) => {
                    const prevLote = selectedObra.lotes[idx - 1];
                    const isPrototipoChange = prevLote && prevLote.prototipo !== lote.prototipo;
                    
                    return (
                      <th
                        key={lote.numero}
                        className={`bg-[#3a3a3a] px-1 py-2 text-white font-bold text-center w-14 border-0 ${
                          isPrototipoChange ? "border-l-4 border-l-gray-700" : ""
                        }`}
                      >
                        <div className="text-[10px] leading-tight font-bold">{lote.numero.replace(/_/g, " ")}</div>
                      </th>
                    );
                  })}
                </tr>
                
                {/* Fila 2: Clave/Concepto + Prototipos - SIN BORDES */}
                <tr className="bg-[#3a3a3a]">
                  <th className="sticky left-0 z-40 bg-[#3a3a3a] px-1 py-1.5 text-white font-bold text-[10px] w-10 border-0">
                    Clave
                  </th>
                  <th className="sticky left-10 z-40 bg-[#3a3a3a] px-2 py-1.5 text-white font-bold text-[10px] text-left w-32 border-0">
                    Concepto
                  </th>
                  {selectedObra.lotes.map((lote, idx) => {
                    const prevLote = selectedObra.lotes[idx - 1];
                    const isPrototipoChange = prevLote && prevLote.prototipo !== lote.prototipo;
                    
                    return (
                      <th
                        key={lote.numero}
                        className={`bg-[#3a3a3a] px-1 py-1.5 text-white font-bold text-center w-14 border-0 ${
                          isPrototipoChange ? "border-l-4 border-l-gray-700" : ""
                        }`}
                      >
                        <div className="text-[9px] text-gray-300 font-bold">{lote.prototipo}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {selectedObra.catalogoConceptos.flatMap((seccion, sIdx) => [
                    <tr key={`sec-${sIdx}`} className="bg-[#2d2d2d]">
                      <td
                        colSpan={2 + selectedObra.lotes.length}
                        className="border-2 border-gray-500 px-2 py-1 text-white font-bold text-xs uppercase"
                      >
                        {seccion.nombre}
                      </td>
                    </tr>,
                    ...seccion.conceptos.map((concepto, cIdx) => {
                      const isOdd = cIdx % 2 === 1;
                      
                      return (
                        <tr key={concepto.id} className={isOdd ? "bg-[#e8e8e8]" : "bg-white"}>
                          <td className={`sticky left-0 z-20 border-2 border-r-3 border-gray-500 px-1 py-0.5 font-mono font-bold text-gray-900 w-10 ${isOdd ? "bg-[#e8e8e8]" : "bg-white"}`}>
                            {concepto.codigo}
                          </td>
                          <td className={`sticky left-10 z-20 border-2 border-r-3 border-gray-500 px-2 py-0.5 text-gray-900 font-semibold w-32 ${isOdd ? "bg-[#e8e8e8]" : "bg-white"}`}>
                            {concepto.nombre}
                          </td>
                          {selectedObra.lotes.map((lote, idx) => {
                            const prevLote = selectedObra.lotes[idx - 1];
                            const isPrototipoChange = prevLote && prevLote.prototipo !== lote.prototipo;
                            const key = `${concepto.id}-${lote.numero}`;
                            const value = getCellValue(key);
                            const isHist = isHistorico(key);
                            const bgColor = value ? (isHist ? "#9ca3af" : getDestajistaColor(value)) : "transparent";
                            const isValidDestajista = mockDestajistas.some((d) => d.iniciales === value);
                            const textColor = value ? (isHist || isValidDestajista ? "#ffffff" : "#000000") : "#000000";
                            const isFocused = focusedCell === key;
                            
                            return (
                              <td
                                key={key}
                                className={`border-2 border-gray-500 p-0 text-center ${
                                  isPrototipoChange ? "border-l-4 border-l-gray-700" : ""
                                }`}
                                style={{ 
                                  backgroundColor: value ? bgColor : "transparent",
                                }}
                              >
                                <input
                                  type="text"
                                  list={`destajistas-${key}`}
                                  value={value}
                                  onChange={(e) => {
                                    if (!isHist) {
                                      const upperValue = e.target.value.toUpperCase();
                                      handleCapturaChange(key, upperValue);
                                    }
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e, key)}
                                  onFocus={(e) => {
                                    setFocusedCell(key);
                                    if (!isHist) {
                                      setTimeout(() => e.target.select(), 0);
                                    }
                                  }}
                                  onBlur={() => {
                                    const currentValue = getCellValue(key);
                                    if (currentValue && !isHist) {
                                      validateCell(key, currentValue);
                                    }
                                  }}
                                  onMouseDown={(e) => {
                                    if (!isHist && e.currentTarget !== document.activeElement) {
                                      e.preventDefault();
                                      e.currentTarget.focus();
                                    }
                                  }}
                                  className="w-full h-full text-center px-0.5 py-1 text-[10px] font-bold uppercase border-0 focus:outline-none"
                                  style={{
                                    backgroundColor: bgColor || "transparent",
                                    color: textColor,
                                    cursor: isHist ? "not-allowed" : "text",
                                    boxShadow: isFocused ? "0 0 0 3px rgba(20, 184, 166, 0.5) inset" : "none",
                                  }}
                                  maxLength={4}
                                  placeholder=""
                                  id={`cell-${key}`}
                                  readOnly={isHist}
                                />
                                <datalist id={`destajistas-${key}`}>
                                  {mockDestajistas.map((d) => (
                                    <option key={d.id} value={d.iniciales}>
                                      {d.nombre}
                                    </option>
                                  ))}
                                </datalist>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  ]
                )}
              </tbody>
            </table>
          </div>

          {!isFullscreen && (
            <div className="mt-3 px-2 flex justify-between items-center">
              <div className="text-sm text-gray-600 font-semibold">
                <span className="font-bold">Históricos guardados:</span> {historicos.length} semanas
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="shadow-sm">
                  Cancelar
                </Button>
                <Button size="sm" className="bg-teal-700 hover:bg-teal-800 shadow-lg">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b-4 border-teal-600 shadow-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleBackToList}
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver a Obras
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {selectedObra.nombre}
                </h1>
                <p className="text-teal-100 text-lg">Código: {selectedObra.codigo}</p>
              </div>
              <CatalogoImportExport
                catalogoConceptos={selectedObra.catalogoConceptos}
                nombreObra={selectedObra.nombre}
                codigoObra={selectedObra.codigo}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="captura" className="w-full">
            <TabsList className="grid w-full max-w-3xl grid-cols-3">
              <TabsTrigger value="captura">
                <ClipboardList className="h-4 w-4 mr-2" />
                Captura
              </TabsTrigger>
              <TabsTrigger value="resumen">
                <DollarSign className="h-4 w-4 mr-2" />
                Resumen de Pagos
              </TabsTrigger>
              <TabsTrigger value="catalogo">
                <FileText className="h-4 w-4 mr-2" />
                Catálogo
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Captura de Avances (Tabla Coordenadas) */}
            <TabsContent value="captura" className="mt-6">
              <CapturaTable />
            </TabsContent>

            {/* TAB 2: Resumen de Pagos (2 Tablas - Imagen 2) */}
            <TabsContent value="resumen" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-teal-800 mb-1">
                      Resumen de Pagos - {vistaResumen === "historicos" ? "Históricos" : vistaResumen === "notas" ? "Solo Notas" : "Semana Actual"}
                    </h2>
                    <p className="text-gray-600">
                      {selectedObra.nombre}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleRecalcular} variant="outline" className="shadow-md">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Recalcular Destajos
                    </Button>
                    <Button onClick={() => setShowNotasDialog(true)} className="bg-amber-600 hover:bg-amber-700 shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Nota
                    </Button>
                  </div>
                </div>

                {/* Botones de toggle para cambiar vista */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setVistaResumen("actuales")} 
                    variant={vistaResumen === "actuales" ? "default" : "outline"}
                    className={vistaResumen === "actuales" ? "bg-teal-700 hover:bg-teal-800" : ""}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Actuales
                  </Button>
                  <Button 
                    onClick={() => setVistaResumen("historicos")} 
                    variant={vistaResumen === "historicos" ? "default" : "outline"}
                    className={vistaResumen === "historicos" ? "bg-teal-700 hover:bg-teal-800" : ""}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Históricos
                  </Button>
                  <Button 
                    onClick={() => setVistaResumen("notas")} 
                    variant={vistaResumen === "notas" ? "default" : "outline"}
                    className={vistaResumen === "notas" ? "bg-amber-700 hover:bg-amber-800" : ""}
                  >
                    <StickyNote className="h-4 w-4 mr-2" />
                    Solo Notas
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
                  {/* TABLA 1: Detalle por Concepto (70%) */}
                  <Card className="shadow-lg">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-slate-700" />
                        Detalle por Concepto
                      </h3>
                      
                      <div className="overflow-x-auto border rounded-lg max-h-[600px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-700 sticky top-0 z-10">
                              <TableHead className="text-white font-bold text-xs text-center">Fecha</TableHead>
                              <TableHead className="text-white font-bold text-xs">Inicial</TableHead>
                              <TableHead className="text-white font-bold text-xs">Destajista</TableHead>
                              <TableHead className="text-white font-bold text-xs">Clave</TableHead>
                              <TableHead className="text-white font-bold text-xs">Concepto</TableHead>
                              <TableHead className="text-white font-bold text-xs text-center">Prototipo</TableHead>
                              <TableHead className="text-white font-bold text-xs text-center">Lote</TableHead>
                              <TableHead className="text-white font-bold text-xs text-right">Importe</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(() => {
                              let currentDestajista = "";
                              let destajistaSubtotal = 0;
                              const rows: JSX.Element[] = [];

                              allCurrentWeekDetails.forEach((item, idx) => {
                                // Si cambia el destajista y no es el primero, agregar fila de subtotal
                                if (item.iniciales !== currentDestajista && currentDestajista !== "") {
                                  const destajista = mockDestajistas.find((d) => d.iniciales === currentDestajista);
                                  rows.push(
                                    <TableRow key={`subtotal-${currentDestajista}`} className="bg-slate-300 border-t-2 border-slate-500">
                                      <TableCell colSpan={7} className="text-right font-bold text-sm">
                                        Subtotal {currentDestajista}:
                                      </TableCell>
                                      <TableCell className="text-right font-bold text-sm" style={{ color: destajista?.color }}>
                                        ${destajistaSubtotal.toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  );
                                  destajistaSubtotal = 0;
                                }

                                currentDestajista = item.iniciales;
                                destajistaSubtotal += item.importe;

                                const destajista = mockDestajistas.find((d) => d.iniciales === item.iniciales);
                                
                                // Determinar color de fondo
                                let bgColor = "";
                                if (item.isNota && !item.isHistorico) {
                                  bgColor = "bg-amber-50"; // Nota semanal
                                } else if (item.isHistorico || (item.isNota && item.isHistorico)) {
                                  bgColor = "bg-gray-100"; // Histórico o nota histórica
                                } else {
                                  bgColor = "bg-white"; // Actual semanal
                                }

                                rows.push(
                                  <TableRow 
                                    key={idx} 
                                    className={`text-xs ${bgColor}`}
                                  >
                                    <TableCell className="text-center text-xs font-mono">
                                      {item.fechaSemana}
                                    </TableCell>
                                    <TableCell>
                                      <div
                                        className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
                                        style={{ backgroundColor: destajista?.color }}
                                      >
                                        {item.iniciales}
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.nombre}</TableCell>
                                    <TableCell className="font-mono">
                                      {item.codigo}
                                      {item.isNota && (
                                        <StickyNote className="h-3 w-3 inline ml-1 text-amber-600" />
                                      )}
                                    </TableCell>
                                    <TableCell>{item.concepto}</TableCell>
                                    <TableCell className="text-center font-semibold">{item.prototipo}</TableCell>
                                    <TableCell className="text-center">{item.lote}</TableCell>
                                    <TableCell className={`text-right font-semibold ${item.importe < 0 ? "text-red-600" : ""}`}>
                                      ${item.importe.toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                );
                              });

                              // Último subtotal
                              if (currentDestajista !== "") {
                                const destajista = mockDestajistas.find((d) => d.iniciales === currentDestajista);
                                rows.push(
                                  <TableRow key={`subtotal-${currentDestajista}-last`} className="bg-slate-300 border-t-2 border-slate-500">
                                    <TableCell colSpan={7} className="text-right font-bold text-sm">
                                      Subtotal {currentDestajista}:
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-sm" style={{ color: destajista?.color }}>
                                      ${destajistaSubtotal.toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                );
                              }

                              return rows;
                            })()}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </Card>

                  {/* TABLA 2: Resumen por Destajista (30%) */}
                  <Card className="shadow-lg">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-slate-700" />
                        Resumen
                      </h3>
                      
                      <div className="overflow-x-auto border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-700">
                              <TableHead className="text-white font-bold text-xs">Inicial</TableHead>
                              <TableHead className="text-white font-bold text-xs">Destajista</TableHead>
                              <TableHead className="text-white font-bold text-xs text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(activePayments).map(([iniciales, data]) => {
                              if (data.total === 0) return null;
                              const destajista = mockDestajistas.find((d) => d.iniciales === iniciales);

                              return (
                                <TableRow 
                                  key={iniciales} 
                                  className="cursor-pointer hover:bg-slate-50 text-xs"
                                  onClick={() => setSelectedDestajista(iniciales)}
                                >
                                  <TableCell>
                                    <div
                                      className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
                                      style={{ backgroundColor: destajista?.color }}
                                    >
                                      {iniciales}
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-semibold">{data.nombre}</TableCell>
                                  <TableCell className="text-right font-bold text-emerald-700">
                                    ${data.total.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            
                            {/* TOTAL GENERAL */}
                            <TableRow className="bg-slate-800">
                              <TableCell colSpan={2} className="text-right text-white font-bold text-sm">
                                TOTAL:
                              </TableCell>
                              <TableCell className="text-right text-white font-bold text-lg">
                                ${Object.values(activePayments).reduce((sum, d) => sum + d.total, 0).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <div className="mt-6 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Total de Destajos ({vistaResumen === "historicos" ? "Históricos" : vistaResumen === "notas" ? "Notas" : "Semana Actual"}):</strong>
                        </p>
                        <p className="text-3xl font-bold text-slate-800">
                          ${Object.values(activePayments).reduce((sum, d) => sum + d.total, 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          {vistaResumen === "historicos" ? "Total de destajos históricos" : 
                           vistaResumen === "notas" ? "Total de notas externas" : 
                           "Gasto de la obra en destajos esta semana"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Catálogo de Conceptos */}
            <TabsContent value="catalogo" className="mt-6">
              {/* Importar Catálogo */}
              <div className="mb-6">
                <CatalogoImporter
                  nombreObra={selectedObra.nombre}
                  onImportSuccess={(nuevoCatalogo) => {
                    console.log("✅ Catálogo importado exitosamente:", nuevoCatalogo);
                    console.log("Total de secciones:", nuevoCatalogo.length);
                    console.log("Total de conceptos:", nuevoCatalogo.reduce((acc, sec) => acc + sec.conceptos.length, 0));
                    // En producción: actualizar state/backend con el nuevo catálogo
                    // Ejemplo: updateObraCatalogo(selectedObra.id, nuevoCatalogo)
                  }}
                />
              </div>

              <Card>
                <div className="p-6">
                  {/* Collapsible Lotes */}
                  <Collapsible open={lotesOpen} onOpenChange={setLotesOpen}>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            {lotesOpen ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span className="font-bold">Configuración de Lotes y Prototipos</span>
                          </Button>
                        </CollapsibleTrigger>
                        {lotesOpen && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingLotes(!editingLotes)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {editingLotes ? "Guardar" : "Editar"}
                          </Button>
                        )}
                      </div>

                      <CollapsibleContent>
                        <div className="overflow-x-auto border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="font-bold py-2 px-3">Lote</TableHead>
                                <TableHead className="font-bold py-2 px-3">Prototipo</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedObra.lotes.map((lote) => (
                                <TableRow key={lote.numero}>
                                  <TableCell className="font-semibold py-2 px-3">
                                    {lote.numero.replace(/_/g, " ")}
                                  </TableCell>
                                  <TableCell className="py-2 px-3">
                                    {editingLotes ? (
                                      <Input
                                        value={lote.prototipo}
                                        onChange={(e) => console.log("Update prototipo")}
                                        className="w-24 h-8"
                                      />
                                    ) : (
                                      <span className="font-medium">{lote.prototipo}</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  {/* Catálogo de Conceptos */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-teal-800 border-b-2 border-teal-200 pb-2 flex-1">
                        CATÁLOGO DE CONCEPTOS Y PRECIOS
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={
                          editingCatalogo
                            ? () => setEditingCatalogo(false)
                            : handleEditCatalogo
                        }
                        className="ml-4"
                      >
                        {editingCatalogo ? (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Guardar
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Editar
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="overflow-x-auto border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="w-28 font-bold">Clave</TableHead>
                            <TableHead className="font-bold">Concepto</TableHead>
                            <TableHead className="text-right w-32 font-bold">
                              70
                            </TableHead>
                            <TableHead className="text-right w-32 font-bold">
                              78
                            </TableHead>
                            <TableHead className="text-right w-32 font-bold">
                              88
                            </TableHead>
                            {editingCatalogo && (
                              <TableHead className="w-20"></TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedObra.catalogoConceptos.flatMap((seccion, sIdx) => [
                              <TableRow key={`cat-sec-${sIdx}`} className="bg-gray-700">
                                <TableCell
                                  colSpan={editingCatalogo ? 6 : 5}
                                  className="text-white font-bold py-2"
                                >
                                  {seccion.nombre}
                                </TableCell>
                              </TableRow>,
                              ...seccion.conceptos.map((concepto) => (
                                <TableRow key={concepto.id}>
                                  <TableCell className="font-mono text-sm">
                                    {concepto.codigo}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {editingCatalogo ? (
                                      <Input
                                        value={concepto.nombre}
                                        onChange={(e) =>
                                          console.log("Update nombre")
                                        }
                                        className="text-sm"
                                      />
                                    ) : (
                                      concepto.nombre
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    {editingCatalogo ? (
                                      <Input
                                        type="number"
                                        value={concepto.precios.prototipo70}
                                        onChange={(e) =>
                                          console.log("Update precio")
                                        }
                                        className="text-right text-sm"
                                      />
                                    ) : (
                                      `$ ${concepto.precios.prototipo70.toFixed(2)}`
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    {editingCatalogo ? (
                                      <Input
                                        type="number"
                                        value={concepto.precios.prototipo78}
                                        onChange={(e) =>
                                          console.log("Update precio")
                                        }
                                        className="text-right text-sm"
                                      />
                                    ) : (
                                      `$ ${concepto.precios.prototipo78.toFixed(2)}`
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    {editingCatalogo ? (
                                      <Input
                                        type="number"
                                        value={concepto.precios.prototipo88}
                                        onChange={(e) =>
                                          console.log("Update precio")
                                        }
                                        className="text-right text-sm"
                                      />
                                    ) : (
                                      `$ ${concepto.precios.prototipo88.toFixed(2)}`
                                    )}
                                  </TableCell>
                                  {editingCatalogo && (
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          console.log("Delete concepto")
                                        }
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </TableCell>
                                  )}
                                </TableRow>
                              ))
                            ]
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Autenticación Requerida</DialogTitle>
              <DialogDescription>
                Ingresa la contraseña para editar el catálogo de conceptos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handlePasswordSubmit}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notas Dialog */}
        <Dialog open={showNotasDialog} onOpenChange={setShowNotasDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nota Externa</DialogTitle>
              <DialogDescription>
                Registra pagos que no están en el catálogo de conceptos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="iniciales">Destajista</Label>
                <Select
                  value={notaForm.iniciales}
                  onValueChange={handleInicialesChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un destajista" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDestajistas.map((d) => (
                      <SelectItem key={d.id} value={d.iniciales}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: d.color }}
                          >
                            {d.iniciales}
                          </div>
                          <span>{d.nombre}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto</Label>
                <Input
                  id="concepto"
                  value={notaForm.concepto}
                  onChange={(e) =>
                    setNotaForm({ ...notaForm, concepto: e.target.value })
                  }
                  placeholder="Ej: Ajuste por material adicional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto (acepta negativos)</Label>
                <Input
                  id="monto"
                  type="number"
                  value={notaForm.monto}
                  onChange={(e) =>
                    setNotaForm({ ...notaForm, monto: e.target.value })
                  }
                  placeholder="Ej: 500 o -300"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNotasDialog(false);
                  setNotaForm({ iniciales: "", concepto: "", monto: "" });
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddNota} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Nota
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ESTADO: DATA - Lista de Obras
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)",
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b-4 border-teal-600 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Button>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Control de Destajos
                </h1>
                <p className="text-teal-100 text-lg">
                  Gestión de destajos por obra y captura semanal de avances
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentView("resumen")}
                className="bg-white text-teal-800 hover:bg-teal-50"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Resumen General
              </Button>
              <Button
                onClick={onManageDestajistas}
                className="bg-white text-teal-800 hover:bg-teal-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Gestionar Destajistas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "resumen" ? (
          <ResumenDestajosWithStates 
            viewState={viewState}
            obras={obrasResumen} 
            onBack={() => setCurrentView("obras")}
          />
        ) : (
          <>
            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockObras.map((obra) => (
                <Card
                  key={obra.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {obra.nombre}
                        </h3>
                        <p className="text-sm text-gray-600">{obra.codigo}</p>
                      </div>
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Home className="h-5 w-5 text-teal-700" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Número de Lotes:</span>
                        <span className="font-semibold text-gray-900">
                          {obra.totalLotes}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Pagado:</span>
                        <span className="font-semibold text-emerald-700">
                          ${(obra.totalPagado / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pagado esta Semana:</span>
                        <span className="font-semibold text-blue-700">
                          ${obra.pagadoSemana.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t bg-gray-50 px-6 py-3">
                    <Button
                      onClick={() => handleSelectObra(obra)}
                      className="w-full bg-teal-700 hover:bg-teal-800"
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
