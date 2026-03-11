/**
 * MOCK API SERVICE - Servicio centralizado de datos en memoria
 *
 * Simula un servidor backend con endpoints para todos los módulos.
 * Los componentes consumen este servicio en lugar de tener datos inline.
 *
 * Inicialización:
 *  - obras: datos de producción (del mock de dashboard)
 *  - personal, destajistas, proveedores: VACÍOS (el usuario los crea)
 */

// ==================== TIPOS ====================

export interface ObraDashboard {
  code: string;
  name: string;
  client: string;
  contractAmount: number;
  actualBalance: number;
  totalEstimates: number;
  totalExpenses: number;
  resident: string;
  status: "Activa" | "Archivada";
  startDate?: string;
  estimatedEndDate?: string;
  contractNumber?: string;
  advancePercentage?: number;
  retentionPercentage?: number;
  residentInitials?: string;
}

export interface PersonalEmployee {
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

export interface Destajista {
  id: string;
  nombre: string;
  iniciales: string;
  color: string;
  especialidad: string;
  telefono?: string;
}

export interface Proveedor {
  id: string;
  proveedor: string;
  razonSocial: string;
  rfc: string;
  direccion: string;
  vendedor: string;
  telefono: string;
  correo: string;
}

// ==================== STORE EN MEMORIA ====================

// Las obras se inicializan con datos de producción (mock de dashboard)
const initialObras: ObraDashboard[] = [
  {
    code: "228",
    name: "CASTELLO F - Fraccionamiento Residencial Meseta",
    client: "Melisa Leal",
    contractAmount: 5250000,
    actualBalance: 1575000,
    totalEstimates: 2100000,
    totalExpenses: 525000,
    resident: "RUBA - Guanajuato, Apaseo El Grande",
    status: "Activa",
    startDate: "2024-08-15",
    estimatedEndDate: "2026-02-28",
    contractNumber: "CONT-2024-228",
    advancePercentage: 30,
    retentionPercentage: 5,
    residentInitials: "RUB",
  },
  {
    code: "229",
    name: "CASTELLO G - Fraccionamiento Residencial Meseta",
    client: "Melisa Leal",
    contractAmount: 4800000,
    actualBalance: 1440000,
    totalEstimates: 1920000,
    totalExpenses: 480000,
    resident: "RUBA - Guanajuato, Apaseo El Grande",
    status: "Activa",
    startDate: "2024-09-01",
    estimatedEndDate: "2025-08-31",
    contractNumber: "CONT-2024-229",
    advancePercentage: 30,
    retentionPercentage: 5,
    residentInitials: "RUB",
  },
  {
    code: "230",
    name: "CASTELLO H - Fraccionamiento Residencial Meseta",
    client: "Arq. Juan Carbon",
    contractAmount: 5100000,
    actualBalance: 1530000,
    totalEstimates: 2040000,
    totalExpenses: 510000,
    resident: "RUBA - Guanajuato, Apaseo El Grande",
    status: "Activa",
    startDate: "2024-10-01",
    estimatedEndDate: "2025-10-31",
    contractNumber: "CONT-2024-230",
    advancePercentage: 30,
    retentionPercentage: 5,
    residentInitials: "RUB",
  },
  {
    code: "231",
    name: "DOZA A - Fraccionamiento Residencial Mayorazgo",
    client: "Sergio Guerrero",
    contractAmount: 6700000,
    actualBalance: 2010000,
    totalEstimates: 2680000,
    totalExpenses: 670000,
    resident: "Atlas - Queretaro, Queretaro",
    status: "Activa",
    startDate: "2024-11-01",
    estimatedEndDate: "2025-11-30",
    contractNumber: "CONT-2024-231",
    advancePercentage: 30,
    retentionPercentage: 5,
    residentInitials: "ATL",
  },
  {
    code: "232",
    name: "BALVANERA - LOTE 25 ETAPA FRACC. PRIVADA PALERMO",
    client: "Violeta Valdivia",
    contractAmount: 8900000,
    actualBalance: 2670000,
    totalEstimates: 3560000,
    totalExpenses: 890000,
    resident: "Antonio Chavez Garcia - Queretaro, Queretaro",
    status: "Activa",
    startDate: "2025-01-01",
    estimatedEndDate: "2026-01-31",
    contractNumber: "CONT-2025-232",
    advancePercentage: 30,
    retentionPercentage: 5,
    residentInitials: "ACG",
  },
  {
    code: "233",
    name: "DOZA C - Fraccionamiento Residencial Mayorazgo",
    client: "Sergio Guerrero",
    contractAmount: 6500000,
    actualBalance: 1950000,
    totalEstimates: 2600000,
    totalExpenses: 650000,
    resident: "ATLAS - Queretaro, El Marquez",
    status: "Activa",
    startDate: "2025-02-01",
    estimatedEndDate: "2025-12-31",
    contractNumber: "CONT-2025-233",
    advancePercentage: 30,
    retentionPercentage: 5,
    residentInitials: "ATL",
  },
];

// Store singleton - persiste durante la sesión del usuario
const store: {
  obras: ObraDashboard[];
  personal: PersonalEmployee[];
  destajistas: Destajista[];
  proveedores: Proveedor[];
} = {
  obras: [...initialObras],
  personal: [],        // VACÍO - el usuario agrega
  destajistas: [],     // VACÍO - el usuario agrega
  proveedores: [],     // VACÍO - el usuario agrega
};

// ==================== API: OBRAS ====================

export const obrasEndpoint = {
  getAll: async (): Promise<{ success: boolean; data: ObraDashboard[] }> => {
    await delay(50);
    return { success: true, data: [...store.obras] };
  },

  getById: async (code: string): Promise<{ success: boolean; data?: ObraDashboard; error?: string }> => {
    await delay(50);
    const obra = store.obras.find((o) => o.code === code);
    if (!obra) return { success: false, error: "Obra no encontrada" };
    return { success: true, data: { ...obra } };
  },

  create: async (data: Omit<ObraDashboard, "actualBalance" | "totalEstimates" | "totalExpenses">): Promise<{ success: boolean; data?: ObraDashboard; error?: string }> => {
    await delay(100);
    // Verificar código único
    if (store.obras.find((o) => o.code === data.code)) {
      return { success: false, error: `Ya existe una obra con el código ${data.code}` };
    }
    const newObra: ObraDashboard = {
      ...data,
      actualBalance: data.contractAmount, // Saldo inicial = monto del contrato
      totalEstimates: 0,
      totalExpenses: 0,
      status: "Activa",
    };
    store.obras.push(newObra);
    return { success: true, data: newObra };
  },

  update: async (code: string, data: Partial<ObraDashboard>): Promise<{ success: boolean; data?: ObraDashboard; error?: string }> => {
    await delay(80);
    const idx = store.obras.findIndex((o) => o.code === code);
    if (idx === -1) return { success: false, error: "Obra no encontrada" };
    store.obras[idx] = { ...store.obras[idx], ...data };
    return { success: true, data: { ...store.obras[idx] } };
  },

  delete: async (code: string): Promise<{ success: boolean; error?: string }> => {
    await delay(80);
    const initialLength = store.obras.length;
    store.obras = store.obras.filter((o) => o.code !== code);
    if (store.obras.length === initialLength) return { success: false, error: "Obra no encontrada" };
    return { success: true };
  },
};

// ==================== API: PERSONAL ====================

export const personalEndpoint = {
  getAll: async (): Promise<{ success: boolean; data: PersonalEmployee[] }> => {
    await delay(50);
    return { success: true, data: [...store.personal] };
  },

  create: async (data: Omit<PersonalEmployee, "id">): Promise<{ success: boolean; data?: PersonalEmployee; error?: string }> => {
    await delay(100);
    const newEmployee: PersonalEmployee = {
      ...data,
      id: `EMP-${String(Date.now()).slice(-6)}`,
    };
    store.personal.push(newEmployee);
    return { success: true, data: newEmployee };
  },

  update: async (id: string, data: Partial<PersonalEmployee>): Promise<{ success: boolean; data?: PersonalEmployee; error?: string }> => {
    await delay(80);
    const idx = store.personal.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, error: "Empleado no encontrado" };
    store.personal[idx] = { ...store.personal[idx], ...data };
    return { success: true, data: { ...store.personal[idx] } };
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    await delay(80);
    const initialLength = store.personal.length;
    store.personal = store.personal.filter((p) => p.id !== id);
    if (store.personal.length === initialLength) return { success: false, error: "Empleado no encontrado" };
    return { success: true };
  },
};

// ==================== API: DESTAJISTAS ====================

export const destajistasEndpoint = {
  getAll: async (): Promise<{ success: boolean; data: Destajista[] }> => {
    await delay(50);
    return { success: true, data: [...store.destajistas] };
  },

  create: async (data: Omit<Destajista, "id">): Promise<{ success: boolean; data?: Destajista; error?: string }> => {
    await delay(100);
    // Verificar iniciales únicas
    if (store.destajistas.find((d) => d.iniciales === data.iniciales)) {
      return { success: false, error: `Ya existe un destajista con las iniciales ${data.iniciales}` };
    }
    const newDestajista: Destajista = {
      ...data,
      id: Date.now().toString(),
    };
    store.destajistas.push(newDestajista);
    return { success: true, data: newDestajista };
  },

  update: async (id: string, data: Partial<Destajista>): Promise<{ success: boolean; data?: Destajista; error?: string }> => {
    await delay(80);
    const idx = store.destajistas.findIndex((d) => d.id === id);
    if (idx === -1) return { success: false, error: "Destajista no encontrado" };
    store.destajistas[idx] = { ...store.destajistas[idx], ...data };
    return { success: true, data: { ...store.destajistas[idx] } };
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    await delay(80);
    const initialLength = store.destajistas.length;
    store.destajistas = store.destajistas.filter((d) => d.id !== id);
    if (store.destajistas.length === initialLength) return { success: false, error: "Destajista no encontrado" };
    return { success: true };
  },
};

// ==================== API: PROVEEDORES ====================

export const proveedoresEndpoint = {
  getAll: async (): Promise<{ success: boolean; data: Proveedor[] }> => {
    await delay(50);
    return { success: true, data: [...store.proveedores] };
  },

  create: async (data: Omit<Proveedor, "id">): Promise<{ success: boolean; data?: Proveedor; error?: string }> => {
    await delay(100);
    const newProveedor: Proveedor = {
      ...data,
      id: `PROV-${Date.now()}`,
    };
    store.proveedores.push(newProveedor);
    return { success: true, data: newProveedor };
  },

  update: async (id: string, data: Partial<Proveedor>): Promise<{ success: boolean; data?: Proveedor; error?: string }> => {
    await delay(80);
    const idx = store.proveedores.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, error: "Proveedor no encontrado" };
    store.proveedores[idx] = { ...store.proveedores[idx], ...data };
    return { success: true, data: { ...store.proveedores[idx] } };
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    await delay(80);
    const initialLength = store.proveedores.length;
    store.proveedores = store.proveedores.filter((p) => p.id !== id);
    if (store.proveedores.length === initialLength) return { success: false, error: "Proveedor no encontrado" };
    return { success: true };
  },
};

// ==================== HELPER ====================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
