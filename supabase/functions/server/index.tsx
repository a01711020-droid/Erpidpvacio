import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-4298db9c/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== OBRAS ====================

app.get("/make-server-4298db9c/api/obras", async (c) => {
  try {
    const obras = await kv.getByPrefix("obra:");
    return c.json(obras);
  } catch (error) {
    console.error("Error al obtener obras:", error);
    return c.json({ error: "Error al obtener obras" }, 500);
  }
});

app.get("/make-server-4298db9c/api/obras/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const obra = await kv.get(`obra:${id}`);
    
    if (!obra) {
      return c.json({ error: "Obra no encontrada" }, 404);
    }
    
    return c.json(obra);
  } catch (error) {
    console.error("Error al obtener obra:", error);
    return c.json({ error: "Error al obtener obra" }, 500);
  }
});

app.post("/make-server-4298db9c/api/obras", async (c) => {
  try {
    const obra = await c.req.json();
    const obraId = obra.obra_id || crypto.randomUUID();
    
    const obraCompleta = {
      ...obra,
      obra_id: obraId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`obra:${obraId}`, obraCompleta);
    return c.json(obraCompleta, 201);
  } catch (error) {
    console.error("Error al crear obra:", error);
    return c.json({ error: "Error al crear obra" }, 500);
  }
});

app.put("/make-server-4298db9c/api/obras/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const obraExistente = await kv.get(`obra:${id}`);
    if (!obraExistente) {
      return c.json({ error: "Obra no encontrada" }, 404);
    }
    
    const obraActualizada = {
      ...obraExistente,
      ...updates,
      obra_id: id,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`obra:${id}`, obraActualizada);
    return c.json(obraActualizada);
  } catch (error) {
    console.error("Error al actualizar obra:", error);
    return c.json({ error: "Error al actualizar obra" }, 500);
  }
});

app.delete("/make-server-4298db9c/api/obras/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`obra:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar obra:", error);
    return c.json({ error: "Error al eliminar obra" }, 500);
  }
});

// ==================== PROVEEDORES ====================

app.get("/make-server-4298db9c/api/proveedores", async (c) => {
  try {
    const proveedores = await kv.getByPrefix("proveedor:");
    return c.json(proveedores);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return c.json({ error: "Error al obtener proveedores" }, 500);
  }
});

app.get("/make-server-4298db9c/api/proveedores/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const proveedor = await kv.get(`proveedor:${id}`);
    
    if (!proveedor) {
      return c.json({ error: "Proveedor no encontrado" }, 404);
    }
    
    return c.json(proveedor);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    return c.json({ error: "Error al obtener proveedor" }, 500);
  }
});

app.post("/make-server-4298db9c/api/proveedores", async (c) => {
  try {
    const proveedor = await c.req.json();
    const proveedorId = proveedor.proveedor_id || crypto.randomUUID();
    
    const proveedorCompleto = {
      ...proveedor,
      proveedor_id: proveedorId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`proveedor:${proveedorId}`, proveedorCompleto);
    return c.json(proveedorCompleto, 201);
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return c.json({ error: "Error al crear proveedor" }, 500);
  }
});

app.put("/make-server-4298db9c/api/proveedores/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const proveedorExistente = await kv.get(`proveedor:${id}`);
    if (!proveedorExistente) {
      return c.json({ error: "Proveedor no encontrado" }, 404);
    }
    
    const proveedorActualizado = {
      ...proveedorExistente,
      ...updates,
      proveedor_id: id,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`proveedor:${id}`, proveedorActualizado);
    return c.json(proveedorActualizado);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    return c.json({ error: "Error al actualizar proveedor" }, 500);
  }
});

app.delete("/make-server-4298db9c/api/proveedores/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`proveedor:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    return c.json({ error: "Error al eliminar proveedor" }, 500);
  }
});

// ==================== ÓRDENES DE COMPRA ====================

app.get("/make-server-4298db9c/api/ordenes-compra", async (c) => {
  try {
    const ordenes = await kv.getByPrefix("orden_compra:");
    return c.json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    return c.json({ error: "Error al obtener órdenes de compra" }, 500);
  }
});

app.get("/make-server-4298db9c/api/ordenes-compra/obra/:obraId", async (c) => {
  try {
    const obraId = c.req.param("obraId");
    const todasOrdenes = await kv.getByPrefix("orden_compra:");
    const ordenesFiltradas = todasOrdenes.filter((o: any) => o.obra_id === obraId);
    return c.json(ordenesFiltradas);
  } catch (error) {
    console.error("Error al obtener órdenes por obra:", error);
    return c.json({ error: "Error al obtener órdenes por obra" }, 500);
  }
});

app.get("/make-server-4298db9c/api/ordenes-compra/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const orden = await kv.get(`orden_compra:${id}`);
    
    if (!orden) {
      return c.json({ error: "Orden de compra no encontrada" }, 404);
    }
    
    return c.json(orden);
  } catch (error) {
    console.error("Error al obtener orden de compra:", error);
    return c.json({ error: "Error al obtener orden de compra" }, 500);
  }
});

app.post("/make-server-4298db9c/api/ordenes-compra", async (c) => {
  try {
    const orden = await c.req.json();
    const ordenId = orden.orden_id || crypto.randomUUID();
    
    const ordenCompleta = {
      ...orden,
      orden_id: ordenId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`orden_compra:${ordenId}`, ordenCompleta);
    return c.json(ordenCompleta, 201);
  } catch (error) {
    console.error("Error al crear orden de compra:", error);
    return c.json({ error: "Error al crear orden de compra" }, 500);
  }
});

app.put("/make-server-4298db9c/api/ordenes-compra/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const ordenExistente = await kv.get(`orden_compra:${id}`);
    if (!ordenExistente) {
      return c.json({ error: "Orden de compra no encontrada" }, 404);
    }
    
    const ordenActualizada = {
      ...ordenExistente,
      ...updates,
      orden_id: id,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`orden_compra:${id}`, ordenActualizada);
    return c.json(ordenActualizada);
  } catch (error) {
    console.error("Error al actualizar orden de compra:", error);
    return c.json({ error: "Error al actualizar orden de compra" }, 500);
  }
});

app.delete("/make-server-4298db9c/api/ordenes-compra/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`orden_compra:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar orden de compra:", error);
    return c.json({ error: "Error al eliminar orden de compra" }, 500);
  }
});

// ==================== DESTAJISTAS ====================

app.get("/make-server-4298db9c/api/destajistas", async (c) => {
  try {
    const destajistas = await kv.getByPrefix("destajista:");
    return c.json(destajistas);
  } catch (error) {
    console.error("Error al obtener destajistas:", error);
    return c.json({ error: "Error al obtener destajistas" }, 500);
  }
});

app.get("/make-server-4298db9c/api/destajistas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const destajista = await kv.get(`destajista:${id}`);
    
    if (!destajista) {
      return c.json({ error: "Destajista no encontrado" }, 404);
    }
    
    return c.json(destajista);
  } catch (error) {
    console.error("Error al obtener destajista:", error);
    return c.json({ error: "Error al obtener destajista" }, 500);
  }
});

app.post("/make-server-4298db9c/api/destajistas", async (c) => {
  try {
    const destajista = await c.req.json();
    const destajistaId = destajista.destajista_id || crypto.randomUUID();
    
    const destajistaCompleto = {
      ...destajista,
      destajista_id: destajistaId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`destajista:${destajistaId}`, destajistaCompleto);
    return c.json(destajistaCompleto, 201);
  } catch (error) {
    console.error("Error al crear destajista:", error);
    return c.json({ error: "Error al crear destajista" }, 500);
  }
});

app.put("/make-server-4298db9c/api/destajistas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const destajistaExistente = await kv.get(`destajista:${id}`);
    if (!destajistaExistente) {
      return c.json({ error: "Destajista no encontrado" }, 404);
    }
    
    const destajistaActualizado = {
      ...destajistaExistente,
      ...updates,
      destajista_id: id,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`destajista:${id}`, destajistaActualizado);
    return c.json(destajistaActualizado);
  } catch (error) {
    console.error("Error al actualizar destajista:", error);
    return c.json({ error: "Error al actualizar destajista" }, 500);
  }
});

app.delete("/make-server-4298db9c/api/destajistas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`destajista:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar destajista:", error);
    return c.json({ error: "Error al eliminar destajista" }, 500);
  }
});

// ==================== AVANCES DE DESTAJOS ====================

app.get("/make-server-4298db9c/api/avances", async (c) => {
  try {
    const avances = await kv.getByPrefix("avance:");
    return c.json(avances);
  } catch (error) {
    console.error("Error al obtener avances:", error);
    return c.json({ error: "Error al obtener avances" }, 500);
  }
});

app.get("/make-server-4298db9c/api/avances/obra/:obraId", async (c) => {
  try {
    const obraId = c.req.param("obraId");
    const todosAvances = await kv.getByPrefix("avance:");
    const avancesFiltrados = todosAvances.filter((a: any) => a.obra_id === obraId);
    return c.json(avancesFiltrados);
  } catch (error) {
    console.error("Error al obtener avances por obra:", error);
    return c.json({ error: "Error al obtener avances por obra" }, 500);
  }
});

app.get("/make-server-4298db9c/api/avances/semana/:year/:week", async (c) => {
  try {
    const year = parseInt(c.req.param("year"));
    const week = parseInt(c.req.param("week"));
    const todosAvances = await kv.getByPrefix("avance:");
    const avancesFiltrados = todosAvances.filter((a: any) => a.año === year && a.semana === week);
    return c.json(avancesFiltrados);
  } catch (error) {
    console.error("Error al obtener avances por semana:", error);
    return c.json({ error: "Error al obtener avances por semana" }, 500);
  }
});

app.post("/make-server-4298db9c/api/avances", async (c) => {
  try {
    const avance = await c.req.json();
    const avanceId = avance.avance_id || crypto.randomUUID();
    
    const avanceCompleto = {
      ...avance,
      avance_id: avanceId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`avance:${avanceId}`, avanceCompleto);
    return c.json(avanceCompleto, 201);
  } catch (error) {
    console.error("Error al crear avance:", error);
    return c.json({ error: "Error al crear avance" }, 500);
  }
});

app.put("/make-server-4298db9c/api/avances/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const avanceExistente = await kv.get(`avance:${id}`);
    if (!avanceExistente) {
      return c.json({ error: "Avance no encontrado" }, 404);
    }
    
    const avanceActualizado = {
      ...avanceExistente,
      ...updates,
      avance_id: id,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`avance:${id}`, avanceActualizado);
    return c.json(avanceActualizado);
  } catch (error) {
    console.error("Error al actualizar avance:", error);
    return c.json({ error: "Error al actualizar avance" }, 500);
  }
});

app.delete("/make-server-4298db9c/api/avances/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`avance:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar avance:", error);
    return c.json({ error: "Error al eliminar avance" }, 500);
  }
});

// ==================== REQUISICIONES ====================

app.get("/make-server-4298db9c/api/requisiciones", async (c) => {
  try {
    const requisiciones = await kv.getByPrefix("requisicion:");
    return c.json(requisiciones);
  } catch (error) {
    console.error("Error al obtener requisiciones:", error);
    return c.json({ error: "Error al obtener requisiciones" }, 500);
  }
});

app.get("/make-server-4298db9c/api/requisiciones/obra/:obraId", async (c) => {
  try {
    const obraId = c.req.param("obraId");
    const todasRequisiciones = await kv.getByPrefix("requisicion:");
    const requisicionesFiltradas = todasRequisiciones.filter((r: any) => r.obra_id === obraId);
    return c.json(requisicionesFiltradas);
  } catch (error) {
    console.error("Error al obtener requisiciones por obra:", error);
    return c.json({ error: "Error al obtener requisiciones por obra" }, 500);
  }
});

app.post("/make-server-4298db9c/api/requisiciones", async (c) => {
  try {
    const requisicion = await c.req.json();
    const requisicionId = requisicion.requisicion_id || crypto.randomUUID();
    
    const requisicionCompleta = {
      ...requisicion,
      requisicion_id: requisicionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`requisicion:${requisicionId}`, requisicionCompleta);
    return c.json(requisicionCompleta, 201);
  } catch (error) {
    console.error("Error al crear requisición:", error);
    return c.json({ error: "Error al crear requisición" }, 500);
  }
});

app.put("/make-server-4298db9c/api/requisiciones/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const requisicionExistente = await kv.get(`requisicion:${id}`);
    if (!requisicionExistente) {
      return c.json({ error: "Requisición no encontrada" }, 404);
    }
    
    const requisicionActualizada = {
      ...requisicionExistente,
      ...updates,
      requisicion_id: id,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(`requisicion:${id}`, requisicionActualizada);
    return c.json(requisicionActualizada);
  } catch (error) {
    console.error("Error al actualizar requisición:", error);
    return c.json({ error: "Error al actualizar requisición" }, 500);
  }
});

app.delete("/make-server-4298db9c/api/requisiciones/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`requisicion:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar requisición:", error);
    return c.json({ error: "Error al eliminar requisición" }, 500);
  }
});

Deno.serve(app.fetch);