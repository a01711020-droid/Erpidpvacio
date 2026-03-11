/**
 * PERSONAL MANAGEMENT (Personal)
 * 
 * Gestión de empleados y colaboradores:
 * - Todos los empleados asignados a una obra (incluyendo OFICINA)
 * - Control de asignaciones por obra
 * - Salarios por día
 * - Días trabajados a la semana
 * - Registro semanal histórico (52 semanas)
 */

import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  ArrowLeft,
  UserCog,
  UserPlus,
  Users,
  Building2,
  Search,
  Edit,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";
import { personalEndpoint } from "@/app/utils/mockApiService";

// Tipos
interface Employee {
  id: string;
  nombre: string;
  puesto: string;
  obraAsignada: string;
  nombreObra: string;
  salarioDia: number;
  diasSemana: number;
  numeroCuenta?: string;
  banco?: string;
  observaciones?: string;
}

interface WeeklyRecord {
  empleadoId: string;
  semana: number; // 1-52
  year: number;
  obraAsignada: string;
  nombreObra: string;
  diasTrabajados: number;
  salarioDia: number;
  salarioPagado: number;
  observaciones: string;
  fechaInicio: string;
  fechaFin: string;
}

// Destajista para consolidado
interface Destajista {
  inicial: string;
  nombre: string;
  importe: number;
}

// Registro de personal para la semana actual (editable)
interface PersonalWeekRecord {
  empleadoId: string;
  diasTrabajados: number;
}

interface PersonalManagementProps {
  onBack: () => void;
  autoOpenAddDialog?: boolean;
}

// Obras disponibles
const OBRAS = [
  { codigo: "228", nombre: "CASTELLO F" },
  { codigo: "229", nombre: "CASTELLO G" },
  { codigo: "230", nombre: "CASTELLO H" },
  { codigo: "231", nombre: "DOZA A" },
  { codigo: "232", nombre: "DOZA C" },
  { codigo: "233", nombre: "BALVANERA" },
  { codigo: "OFICINA", nombre: "OFICINA" },
];

// Generar fechas de semanas del año
const getWeekDates = (year: number, weekNumber: number) => {
  const firstDay = new Date(year, 0, 1);
  const dayOfWeek = firstDay.getDay();
  const daysSinceFirstMonday = (dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek);
  
  const firstMonday = new Date(year, 0, firstDay.getDate() + daysSinceFirstMonday);
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const formatDate = (d: Date) => {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${day}/${month}`;
  };
  
  return {
    inicio: formatDate(weekStart),
    fin: formatDate(weekEnd),
  };
};

// Mock data - Destajistas de la semana (viniendo del módulo de Destajos)
const mockDestajistas: Destajista[] = [
  { inicial: "JP", nombre: "Juan Pérez", importe: 125000 },
  { inicial: "MG", nombre: "María González", importe: 98000 },
  { inicial: "LS", nombre: "Luis Sánchez", importe: 112000 },
  { inicial: "AC", nombre: "Ana Cruz", importe: 87500 },
  { inicial: "RH", nombre: "Roberto Hernández", importe: 95000 },
  { inicial: "CF", nombre: "Carlos Flores", importe: 103000 },
  { inicial: "PM", nombre: "Pedro Morales", importe: 88500 },
  { inicial: "DV", nombre: "Diana Vega", importe: 91000 },
  { inicial: "JR", nombre: "José Ramírez", importe: 107000 },
  { inicial: "LM", nombre: "Laura Méndez", importe: 94500 },
  { inicial: "AM", nombre: "Alberto Mata", importe: 89000 },
  { inicial: "SR", nombre: "Sandra Rojas", importe: 96000 },
];

// Generar iniciales de 3 letras del nombre
const getInitials = (nombre: string): string => {
  const palabras = nombre.trim().split(/\s+/);
  if (palabras.length === 1) {
    // Un solo nombre, tomar primeras 3 letras
    return palabras[0].substring(0, 3).toUpperCase();
  } else if (palabras.length === 2) {
    // Dos palabras: primera letra de cada una + primera del apellido
    return (palabras[0][0] + palabras[1].substring(0, 2)).toUpperCase();
  } else {
    // Tres o más: primera letra de nombre, primera de segundo nombre, primera de apellido
    return (palabras[0][0] + palabras[1][0] + palabras[2][0]).toUpperCase();
  }
};

// Mock data - Registros semanales (últimas 8 semanas como ejemplo)
const generateMockWeeklyRecords = (): WeeklyRecord[] => {
  const records: WeeklyRecord[] = [];
  const currentYear = 2025;
  
  // Generar registros para las últimas 8 semanas (semana 1-8 del 2025)
  for (let semana = 1; semana <= 8; semana++) {
    const dates = getWeekDates(currentYear, semana);
    
    // EMP-001 - Juan Carlos (estuvo en diferentes obras)
    records.push({
      empleadoId: "EMP-001",
      semana,
      year: currentYear,
      obraAsignada: semana <= 3 ? "228" : semana <= 6 ? "229" : "228",
      nombreObra: semana <= 3 ? "CASTELLO F" : semana <= 6 ? "CASTELLO G" : "CASTELLO F",
      diasTrabajados: semana === 4 ? 5.5 : 6,
      salarioDia: 450,
      salarioPagado: semana === 4 ? 2475 : 2700,
      observaciones: semana === 4 ? "Salió temprano el sábado" : "",
      fechaInicio: dates.inicio,
      fechaFin: dates.fin,
    });
    
    // EMP-008 - Ana María (oficina y obras)
    records.push({
      empleadoId: "EMP-008",
      semana,
      year: currentYear,
      obraAsignada: semana === 2 || semana === 5 ? "228" : "OFICINA",
      nombreObra: semana === 2 || semana === 5 ? "CASTELLO F" : "OFICINA",
      diasTrabajados: 5,
      salarioDia: 800,
      salarioPagado: 4000,
      observaciones: semana === 2 ? "Supervisión en obra" : semana === 5 ? "Revisión de avances" : "",
      fechaInicio: dates.inicio,
      fechaFin: dates.fin,
    });
  }
  
  return records;
};

export default function PersonalManagement({ onBack, autoOpenAddDialog = false }: PersonalManagementProps) {
  // Estado vacío - los empleados se agregan a través del formulario
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObra, setSelectedObra] = useState<string>("ALL");
  
  // Cargar empleados desde el mock API al montar
  useEffect(() => {
    personalEndpoint.getAll().then((res) => {
      if (res.success) {
        setEmployees(res.data as Employee[]);
        setPersonalWeekRecords(
          res.data.map((emp: any) => ({
            empleadoId: emp.id,
            diasTrabajados: emp.diasSemana,
          }))
        );
      }
    });
  }, []);
  
  // Consolidado - Navegación de semanas
  const [semanaActual, setSemanaActual] = useState(7);
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());
  
  // Estado para días trabajados del personal en la semana actual (editable)
  const [personalWeekRecords, setPersonalWeekRecords] = useState<PersonalWeekRecord[]>([]);
  
  // Dialog para editar días trabajados
  const [showEditDaysDialog, setShowEditDaysDialog] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState<{ empleadoId: string; nombre: string } | null>(null);
  const [tempDiasTrabajados, setTempDiasTrabajados] = useState("");
  
  // Weekly tab state
  const [selectedEmployeeForWeekly, setSelectedEmployeeForWeekly] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [showEditWeekDialog, setShowEditWeekDialog] = useState(false);
  const [editingWeek, setEditingWeek] = useState<{semana: number; record?: WeeklyRecord} | null>(null);
  const [weekForm, setWeekForm] = useState({
    obraAsignada: "",
    diasTrabajados: "",
    observaciones: "",
  });

  // Dialogs
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(autoOpenAddDialog);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Forms
  const [editForm, setEditForm] = useState({
    nombre: "",
    puesto: "",
    obraAsignada: "",
    nombreObra: "",
    salarioDia: "",
    diasSemana: "",
    numeroCuenta: "",
    banco: "",
    observaciones: "",
  });

  const [addForm, setAddForm] = useState({
    nombre: "",
    puesto: "",
    obraAsignada: "",
    salarioDia: "",
    diasSemana: "6",
    numeroCuenta: "",
    banco: "",
    observaciones: "",
  });

  // CRUD Empleados
  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      nombre: employee.nombre,
      puesto: employee.puesto,
      obraAsignada: employee.obraAsignada,
      nombreObra: employee.nombreObra,
      salarioDia: employee.salarioDia.toString(),
      diasSemana: employee.diasSemana.toString(),
      numeroCuenta: employee.numeroCuenta || "",
      banco: employee.banco || "",
      observaciones: employee.observaciones || "",
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEmployee) return;
    const obra = OBRAS.find((o) => o.codigo === editForm.obraAsignada);

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              nombre: editForm.nombre,
              puesto: editForm.puesto,
              obraAsignada: editForm.obraAsignada,
              nombreObra: obra?.nombre || editForm.nombreObra,
              salarioDia: parseFloat(editForm.salarioDia),
              diasSemana: parseFloat(editForm.diasSemana),
              numeroCuenta: editForm.numeroCuenta,
              banco: editForm.banco,
              observaciones: editForm.observaciones,
            }
          : emp
      )
    );

    setShowEditDialog(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = () => {
    const obra = OBRAS.find((o) => o.codigo === addForm.obraAsignada);
    if (!obra) return;

    const employeeData = {
      nombre: addForm.nombre,
      puesto: addForm.puesto,
      obraAsignada: addForm.obraAsignada,
      nombreObra: obra.nombre,
      salarioDia: parseFloat(addForm.salarioDia),
      diasSemana: parseFloat(addForm.diasSemana),
      numeroCuenta: addForm.numeroCuenta,
      banco: addForm.banco,
      observaciones: addForm.observaciones,
    };

    // Guardar en mock API service
    personalEndpoint.create(employeeData).then((res) => {
      if (res.success && res.data) {
        const newEmployee = res.data as Employee;
        setEmployees((prev) => [...prev, newEmployee]);
        setPersonalWeekRecords((prev) => [
          ...prev,
          { empleadoId: newEmployee.id, diasTrabajados: newEmployee.diasSemana },
        ]);
      }
    });

    setShowAddDialog(false);
    setAddForm({
      nombre: "",
      puesto: "",
      obraAsignada: "",
      salarioDia: "",
      diasSemana: "6",
      numeroCuenta: "",
      banco: "",
      observaciones: "",
    });
  };
  
  // Funciones para editar días trabajados del personal
  const handleOpenEditDays = (empleadoId: string, nombre: string, diasActuales: number) => {
    setEditingPersonal({ empleadoId, nombre });
    setTempDiasTrabajados(diasActuales.toString());
    setShowEditDaysDialog(true);
  };
  
  const handleSaveDays = () => {
    if (!editingPersonal) return;
    
    setPersonalWeekRecords(
      personalWeekRecords.map(record =>
        record.empleadoId === editingPersonal.empleadoId
          ? { ...record, diasTrabajados: parseFloat(tempDiasTrabajados) }
          : record
      )
    );
    
    setShowEditDaysDialog(false);
    setEditingPersonal(null);
  };

  // CRUD Weekly Records
  const handleOpenEditWeek = (semana: number, empleadoId: string) => {
    const existingRecord = weeklyRecords.find(
      (r) => r.semana === semana && r.empleadoId === empleadoId && r.year === selectedYear
    );
    
    const emp = employees.find((e) => e.id === empleadoId);
    
    setEditingWeek({ semana, record: existingRecord });
    setWeekForm({
      obraAsignada: existingRecord?.obraAsignada || emp?.obraAsignada || "",
      diasTrabajados: existingRecord?.diasTrabajados.toString() || emp?.diasSemana.toString() || "6",
      observaciones: existingRecord?.observaciones || "",
    });
    setShowEditWeekDialog(true);
  };

  const handleSaveWeek = () => {
    if (!editingWeek || !selectedEmployeeForWeekly) return;

    const emp = employees.find((e) => e.id === selectedEmployeeForWeekly);
    if (!emp) return;

    const obra = OBRAS.find((o) => o.codigo === weekForm.obraAsignada);
    if (!obra) return;

    const diasTrabajados = parseFloat(weekForm.diasTrabajados);
    const salarioPagado = emp.salarioDia * diasTrabajados;
    const dates = getWeekDates(selectedYear, editingWeek.semana);

    const newRecord: WeeklyRecord = {
      empleadoId: selectedEmployeeForWeekly,
      semana: editingWeek.semana,
      year: selectedYear,
      obraAsignada: weekForm.obraAsignada,
      nombreObra: obra.nombre,
      diasTrabajados,
      salarioDia: emp.salarioDia,
      salarioPagado,
      observaciones: weekForm.observaciones,
      fechaInicio: dates.inicio,
      fechaFin: dates.fin,
    };

    // Actualizar o agregar registro
    const existingIndex = weeklyRecords.findIndex(
      (r) => r.semana === editingWeek.semana && r.empleadoId === selectedEmployeeForWeekly && r.year === selectedYear
    );

    if (existingIndex >= 0) {
      setWeeklyRecords(
        weeklyRecords.map((r, i) => (i === existingIndex ? newRecord : r))
      );
    } else {
      setWeeklyRecords([...weeklyRecords, newRecord]);
    }

    setShowEditWeekDialog(false);
    setEditingWeek(null);
  };

  // Filtros
  const filteredEmployees = employees.filter((emp) => {
    const matchesObra = selectedObra === "ALL" || emp.obraAsignada === selectedObra;
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.puesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.nombreObra.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesObra && matchesSearch;
  });

  // Colores por obra
  const getObraColor = (codigo: string) => {
    const colores: Record<string, string> = {
      "228": "bg-blue-100 text-blue-800 border-blue-300",
      "229": "bg-green-100 text-green-800 border-green-300",
      "230": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "231": "bg-pink-100 text-pink-800 border-pink-300",
      "232": "bg-cyan-100 text-cyan-800 border-cyan-300",
      "233": "bg-orange-100 text-orange-800 border-orange-300",
      "OFICINA": "bg-slate-100 text-slate-800 border-slate-300",
    };
    return colores[codigo] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Stats
  const totalEmpleados = employees.length;
  const empleadosObras = employees.filter((e) => e.obraAsignada !== "OFICINA").length;
  const empleadosOficina = employees.filter((e) => e.obraAsignada === "OFICINA").length;
  const nominaSemanalEstimada = employees.reduce(
    (sum, emp) => sum + emp.salarioDia * emp.diasSemana,
    0
  );

  // Weekly records para el empleado seleccionado
  const employeeWeeklyRecords = selectedEmployeeForWeekly
    ? weeklyRecords.filter(
        (r) => r.empleadoId === selectedEmployeeForWeekly && r.year === selectedYear
      )
    : [];

  const totalPagadoAnual = employeeWeeklyRecords.reduce(
    (sum, r) => sum + r.salarioPagado,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <UserCog className="h-10 w-10 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Gestión de Personal</h1>
                  <p className="text-gray-200 text-sm">Control y administración de nómina</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2 bg-white text-gray-800 hover:bg-gray-100"
            >
              <UserPlus className="h-5 w-5" />
              Nuevo Empleado
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs defaultValue="consolidado" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200">
            <TabsTrigger value="consolidado" className="gap-2">
              <Calendar className="h-4 w-4" />
              Consolidado de Nómina
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Users className="h-4 w-4" />
              Administración de Personal
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CONSOLIDADO DE NÓMINA */}
          <TabsContent value="consolidado" className="space-y-6">
            <Card className="border-gray-300 bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Consolidado Total - Semana {semanaActual}
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-medium">
                      Año {añoActual}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mockDestajistas.length} Destajistas + {employees.length} Personal
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Controles de Navegación de Semana */}
                <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (semanaActual === 1) {
                          setSemanaActual(52);
                          setAñoActual(añoActual - 1);
                        } else {
                          setSemanaActual(semanaActual - 1);
                        }
                      }}
                      className="gap-1 bg-white hover:bg-slate-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Select 
                        value={semanaActual.toString()}
                        onValueChange={(v) => setSemanaActual(parseInt(v))}
                      >
                        <SelectTrigger className="w-[140px] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                            <SelectItem key={week} value={week.toString()}>
                              Semana {week}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={añoActual.toString()}
                        onValueChange={(v) => setAñoActual(parseInt(v))}
                      >
                        <SelectTrigger className="w-[110px] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (semanaActual === 52) {
                          setSemanaActual(1);
                          setAñoActual(añoActual + 1);
                        } else {
                          setSemanaActual(semanaActual + 1);
                        }
                      }}
                      className="gap-1 bg-white hover:bg-slate-100"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {getWeekDates(añoActual, semanaActual).inicio} - {getWeekDates(añoActual, semanaActual).fin}
                  </div>
                </div>
                
                <div className="border rounded-lg bg-white border-gray-300 overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="text-white font-bold text-left px-4 py-3">Tipo</th>
                        <th className="text-white font-bold text-left px-4 py-3">Nombre</th>
                        <th className="text-white font-bold text-left px-4 py-3">Clave</th>
                        <th className="text-white font-bold text-center px-4 py-3">Días</th>
                        <th className="text-white font-bold text-right px-4 py-3">Monto de Pago S{semanaActual}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* DESTAJISTAS */}
                      {mockDestajistas.map((destajista, idx) => {
                        const codigoPago = `DEST-${destajista.inicial}-S${semanaActual.toString().padStart(2, '0')}-${añoActual.toString().slice(-2)}`;
                        
                        return (
                          <tr
                            key={`dest-${destajista.inicial}`}
                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                Destajista
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-medium">{destajista.nombre}</td>
                            <td className="px-4 py-3 font-mono text-sm text-gray-700">{codigoPago}</td>
                            <td className="px-4 py-3 text-center text-gray-500">-</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                              ${destajista.importe.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                      
                      {/* PERSONAL */}
                      {employees.map((emp, idx) => {
                        const iniciales = getInitials(emp.nombre);
                        const codigoPago = `NOM-${iniciales}-S${semanaActual.toString().padStart(2, '0')}-${añoActual.toString().slice(-2)}`;
                        const diasTrabajados = personalWeekRecords.find(r => r.empleadoId === emp.id)?.diasTrabajados || emp.diasSemana;
                        const monto = emp.salarioDia * diasTrabajados;
                        const globalIdx = mockDestajistas.length + idx;
                        
                        return (
                          <tr
                            key={`emp-${emp.id}`}
                            className={globalIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                                Personal
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-medium">{emp.nombre}</td>
                            <td className="px-4 py-3 font-mono text-sm text-gray-700">{codigoPago}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setPersonalWeekRecords(
                                      personalWeekRecords.map(record =>
                                        record.empleadoId === emp.id && record.diasTrabajados > 0
                                          ? { ...record, diasTrabajados: Math.max(0, record.diasTrabajados - 0.5) }
                                          : record
                                      )
                                    );
                                  }}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="font-semibold text-gray-900 min-w-[2rem] text-center">{diasTrabajados}</span>
                                <button
                                  onClick={() => {
                                    setPersonalWeekRecords(
                                      personalWeekRecords.map(record =>
                                        record.empleadoId === emp.id && record.diasTrabajados < 7
                                          ? { ...record, diasTrabajados: Math.min(7, record.diasTrabajados + 0.5) }
                                          : record
                                      )
                                    );
                                  }}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                              ${monto.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                      
                      {/* TOTALES */}
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold">
                        <td colSpan={4} className="px-4 py-4 text-right text-lg">
                          TOTAL SEMANA {semanaActual}:
                        </td>
                        <td className="px-4 py-4 text-right text-xl">
                          ${(
                            mockDestajistas.reduce((sum, d) => sum + d.importe, 0) +
                            employees.reduce((sum, emp) => {
                              const dias = personalWeekRecords.find(r => r.empleadoId === emp.id)?.diasTrabajados || emp.diasSemana;
                              return sum + (emp.salarioDia * dias);
                            }, 0)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: ADMINISTRACIÓN DE PERSONAL */}
          <TabsContent value="employees" className="space-y-6">
            {/* Filters */}
            <Card className="border-gray-300">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, puesto u obra..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedObra} onValueChange={setSelectedObra}>
                    <SelectTrigger className="w-full sm:w-[220px]">
                      <SelectValue placeholder="Filtrar por obra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todas las Ubicaciones</SelectItem>
                      {OBRAS.map((obra) => (
                        <SelectItem key={obra.codigo} value={obra.codigo}>
                          {obra.codigo === "OFICINA"
                            ? "OFICINA"
                            : `${obra.codigo} - ${obra.nombre}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Empleados */}
            <Card className="border-gray-300">
              <CardHeader>
                <CardTitle>Empleados Activos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 border-b font-semibold text-sm text-gray-700">
                  <div className="col-span-3">Obra Asignada</div>
                  <div className="col-span-3">Nombre</div>
                  <div className="col-span-2 text-center">Salario</div>
                  <div className="col-span-2 text-center">Días/Sem</div>
                  <div className="col-span-2 text-right">Acciones</div>
                </div>

                {/* Filas */}
                <div className="divide-y">
                  {filteredEmployees.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No se encontraron empleados</p>
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const salarioSemanal = emp.salarioDia * emp.diasSemana;

                      return (
                        <div
                          key={emp.id}
                          className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="col-span-3">
                            <p className="font-semibold text-gray-900">
                              {emp.obraAsignada === "OFICINA"
                                ? "OFICINA"
                                : `${emp.obraAsignada} - ${emp.nombreObra}`}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <p className="font-semibold text-gray-900">{emp.nombre}</p>
                            <p className="text-xs text-gray-500">{emp.id}</p>
                            {emp.observaciones && (
                              <p className="text-xs text-gray-700 mt-1">
                                📝 {emp.observaciones}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2 text-center">
                            <p className="text-lg font-bold text-green-600">
                              ${salarioSemanal.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${emp.salarioDia.toLocaleString()}/día
                            </p>
                          </div>
                          <div className="col-span-2 text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              {emp.diasSemana}
                            </p>
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit(emp)}
                              className="gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog - Editar Empleado */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifique los datos del empleado o reasigne a otra obra
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre Completo</Label>
              <Input
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              />
            </div>

            <div>
              <Label>Puesto</Label>
              <Input
                value={editForm.puesto}
                onChange={(e) => setEditForm({ ...editForm, puesto: e.target.value })}
              />
            </div>

            <div>
              <Label>Obra Asignada</Label>
              <Select
                value={editForm.obraAsignada}
                onValueChange={(value) => {
                  const obra = OBRAS.find((o) => o.codigo === value);
                  setEditForm({
                    ...editForm,
                    obraAsignada: value,
                    nombreObra: obra?.nombre || "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBRAS.map((obra) => (
                    <SelectItem key={obra.codigo} value={obra.codigo}>
                      {obra.codigo === "OFICINA"
                        ? "OFICINA"
                        : `${obra.codigo} - ${obra.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salario por Día</Label>
                <Input
                  type="number"
                  value={editForm.salarioDia}
                  onChange={(e) => setEditForm({ ...editForm, salarioDia: e.target.value })}
                />
              </div>

              <div>
                <Label>Días por Semana</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="7"
                  step="0.5"
                  value={editForm.diasSemana}
                  onChange={(e) => setEditForm({ ...editForm, diasSemana: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Número de Cuenta</Label>
              <Input
                value={editForm.numeroCuenta}
                onChange={(e) => setEditForm({ ...editForm, numeroCuenta: e.target.value })}
              />
            </div>

            <div>
              <Label>Banco</Label>
              <Input
                value={editForm.banco}
                onChange={(e) => setEditForm({ ...editForm, banco: e.target.value })}
              />
            </div>

            <div>
              <Label>Observaciones</Label>
              <Input
                value={editForm.observaciones}
                onChange={(e) =>
                  setEditForm({ ...editForm, observaciones: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Agregar Empleado */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Registre un nuevo empleado y asígnelo a una obra
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre Completo</Label>
              <Input
                value={addForm.nombre}
                onChange={(e) => setAddForm({ ...addForm, nombre: e.target.value })}
              />
            </div>

            <div>
              <Label>Puesto</Label>
              <Input
                value={addForm.puesto}
                onChange={(e) => setAddForm({ ...addForm, puesto: e.target.value })}
              />
            </div>

            <div>
              <Label>Obra Asignada</Label>
              <Select
                value={addForm.obraAsignada}
                onValueChange={(value) => setAddForm({ ...addForm, obraAsignada: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione obra" />
                </SelectTrigger>
                <SelectContent>
                  {OBRAS.map((obra) => (
                    <SelectItem key={obra.codigo} value={obra.codigo}>
                      {obra.codigo === "OFICINA"
                        ? "OFICINA"
                        : `${obra.codigo} - ${obra.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salario por Día</Label>
                <Input
                  type="number"
                  value={addForm.salarioDia}
                  onChange={(e) => setAddForm({ ...addForm, salarioDia: e.target.value })}
                />
              </div>

              <div>
                <Label>Días por Semana</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="7"
                  step="0.5"
                  value={addForm.diasSemana}
                  onChange={(e) => setAddForm({ ...addForm, diasSemana: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Número de Cuenta</Label>
              <Input
                value={addForm.numeroCuenta}
                onChange={(e) => setAddForm({ ...addForm, numeroCuenta: e.target.value })}
              />
            </div>

            <div>
              <Label>Banco</Label>
              <Input
                value={addForm.banco}
                onChange={(e) => setAddForm({ ...addForm, banco: e.target.value })}
              />
            </div>

            <div>
              <Label>Observaciones</Label>
              <Input
                value={addForm.observaciones}
                onChange={(e) => setAddForm({ ...addForm, observaciones: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddEmployee}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                !addForm.nombre ||
                !addForm.puesto ||
                !addForm.obraAsignada ||
                !addForm.salarioDia ||
                !addForm.diasSemana
              }
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Empleado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Editar Días Trabajados (Consolidado) */}
      <Dialog open={showEditDaysDialog} onOpenChange={setShowEditDaysDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Días Trabajados</DialogTitle>
            <DialogDescription>
              Edite los días trabajados de {editingPersonal?.nombre} para la Semana {semanaActual}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">
                {editingPersonal?.nombre}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Semana {semanaActual} del {añoActual}
              </p>
            </div>

            <div>
              <Label>Días Trabajados</Label>
              <Input
                type="number"
                min="0"
                max="7"
                step="0.5"
                value={tempDiasTrabajados}
                onChange={(e) => setTempDiasTrabajados(e.target.value)}
                placeholder="6"
                className="text-lg font-semibold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puede ingresar medios días (ejemplo: 5.5)
              </p>
            </div>

            {tempDiasTrabajados && editingPersonal && (() => {
              const emp = employees.find(e => e.id === editingPersonal.empleadoId);
              if (!emp) return null;
              const monto = emp.salarioDia * parseFloat(tempDiasTrabajados);
              
              return (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Pago Calculado:</span>
                  </p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    ${monto.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    ${emp.salarioDia.toLocaleString()}/día × {tempDiasTrabajados} días
                  </p>
                </div>
              );
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDaysDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveDays}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!tempDiasTrabajados || parseFloat(tempDiasTrabajados) < 0 || parseFloat(tempDiasTrabajados) > 7}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Editar Semana */}
      <Dialog open={showEditWeekDialog} onOpenChange={setShowEditWeekDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Registrar Semana {editingWeek?.semana} - {selectedYear}
            </DialogTitle>
            <DialogDescription>
              Registre en qué obra trabajó y cuántos días laboró esta semana
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingWeek && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">
                  Semana {editingWeek.semana} •{" "}
                  {getWeekDates(selectedYear, editingWeek.semana).inicio} -{" "}
                  {getWeekDates(selectedYear, editingWeek.semana).fin}
                </p>
              </div>
            )}

            <div>
              <Label>Obra Asignada</Label>
              <Select
                value={weekForm.obraAsignada}
                onValueChange={(value) =>
                  setWeekForm({ ...weekForm, obraAsignada: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione obra" />
                </SelectTrigger>
                <SelectContent>
                  {OBRAS.map((obra) => (
                    <SelectItem key={obra.codigo} value={obra.codigo}>
                      {obra.codigo === "OFICINA"
                        ? "OFICINA"
                        : `${obra.codigo} - ${obra.nombre}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Días Trabajados</Label>
              <Input
                type="number"
                min="0"
                max="7"
                step="0.5"
                value={weekForm.diasTrabajados}
                onChange={(e) =>
                  setWeekForm({ ...weekForm, diasTrabajados: e.target.value })
                }
                placeholder="6"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puede ingresar medios días (ejemplo: 5.5)
              </p>
            </div>

            <div>
              <Label>Observaciones</Label>
              <Textarea
                value={weekForm.observaciones}
                onChange={(e) =>
                  setWeekForm({ ...weekForm, observaciones: e.target.value })
                }
                rows={3}
                placeholder="Ejemplo: Trabajó horas extra el viernes"
              />
            </div>

            {weekForm.diasTrabajados && selectedEmployeeForWeekly && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Salario a Pagar:</span>{" "}
                  <span className="text-blue-700 font-bold">
                    $
                    {(
                      (employees.find((e) => e.id === selectedEmployeeForWeekly)
                        ?.salarioDia || 0) * parseFloat(weekForm.diasTrabajados)
                    ).toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditWeekDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveWeek}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!weekForm.obraAsignada || !weekForm.diasTrabajados}
            >
              Guardar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}