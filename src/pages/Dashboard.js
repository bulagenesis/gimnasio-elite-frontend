import React, { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [reporteMensual, setReporteMensual] = useState({
    ingresosMembresias: 0,
    ingresosProductos: 0,
    totalIngresos: 0,
  });

  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [pagosRecientes, setPagosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClientes: 0,
    membresiasActivas: 0,
    totalVentas: 0,
    ingresosTotales: 0,
  });

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);

      // Cargar datos principales
      const [clientesData, pagosData, productosData, ventasData] = await Promise.all([
        api.getClientes().catch(() => []),
        api.getPagos().catch(() => []),
        api.getProductos().catch(() => []),
        api.getVentas().catch(() => []), // Si falla, usa array vacío
      ]);

      // Procesar datos REALES
      const totalClientes = clientesData.length;
      const membresiasActivas = calcularMembresiasActivas(pagosData);
      
      const ingresosMembresias = pagosData.reduce((total, pago) => 
        total + (Number(pago.valor) || 0), 0
      );
      
      const ingresosProductos = ventasData.reduce((total, venta) => 
        total + (Number(venta.total) || 0), 0
      );

      const totalIngresos = ingresosMembresias + ingresosProductos;

      // Productos más vendidos (solo si hay ventas)
      const productosMasVendidosArray = ventasData.length > 0 
        ? calcularProductosMasVendidos(ventasData, productosData)
        : [];

      // Ordenar datos recientes
      const ventasRecientesArray = [...ventasData]
        .sort((a, b) => new Date(b.fecha_venta) - new Date(a.fecha_venta))
        .slice(0, 5);

      const pagosRecientesArray = [...pagosData]
        .sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago))
        .slice(0, 5);

      // Actualizar estados
      setStats({
        totalClientes,
        membresiasActivas,
        totalVentas: ventasData.length,
        ingresosTotales: totalIngresos,
      });

      setReporteMensual({
        ingresosMembresias,
        ingresosProductos,
        totalIngresos,
      });

      setProductosMasVendidos(productosMasVendidosArray);
      setVentasRecientes(ventasRecientesArray);
      setPagosRecientes(pagosRecientesArray);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularMembresiasActivas = (pagos) => {
    if (!pagos.length) return 0;
    
    const treintaDiasAtras = new Date();
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);
    
    const pagosRecientes = pagos.filter(pago => {
      const fechaPago = new Date(pago.fecha_pago);
      return fechaPago >= treintaDiasAtras;
    });
    
    const clientesActivos = new Set(pagosRecientes.map(pago => pago.cliente_id));
    return clientesActivos.size;
  };

  const calcularProductosMasVendidos = (ventas, productos) => {
    if (!ventas.length) return [];

    const resumen = {};

    ventas.forEach((venta) => {
      venta.productos?.forEach((productoVenta) => {
        const id = productoVenta.producto_id;
        
        if (!resumen[id]) {
          const infoProducto = productos.find(prod => prod.id === id);
          resumen[id] = {
            nombre: infoProducto?.nombre || "Producto",
            vendidos: 0,
            ingresos: 0,
          };
        }

        resumen[id].vendidos += productoVenta.cantidad;
        resumen[id].ingresos += productoVenta.subtotal;
      });
    });

    return Object.values(resumen)
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5);
  };

  const fMoneda = (num) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num || 0);

  const fFecha = (f) => {
    if (!f) return "N/A";
    return new Date(f).toLocaleDateString("es-CO");
  };

  const fFechaHora = (f) => {
    if (!f) return "N/A";
    return new Date(f).toLocaleString("es-CO");
  };

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h2 className="text-dark mb-0">Dashboard General</h2>
        <small className="text-muted">Resumen financiero del gimnasio</small>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3 text-muted">Cargando datos...</p>
        </div>
      ) : (
        <>
          {/* STATS PRINCIPALES - SIN GASTOS */}
          <div className="row g-4 mb-4">
            {[
              {
                label: "Total Clientes",
                value: stats.totalClientes,
                icon: "👥",
                color: "primary",
              },
              {
                label: "Membresías Activas",
                value: stats.membresiasActivas,
                icon: "🎫",
                color: "success",
              },
              {
                label: "Ventas Realizadas",
                value: stats.totalVentas,
                icon: "🛒",
                color: "info",
              },
              {
                label: "Ingresos Totales",
                value: fMoneda(stats.ingresosTotales),
                icon: "💰",
                color: "warning",
              },
            ].map((c, i) => (
              <div key={i} className="col-md-3">
                <div className="card shadow-sm border-0 text-center p-3">
                  <div className={`text-${c.color} mb-2`} style={{ fontSize: '2rem' }}>
                    {c.icon}
                  </div>
                  <h4 className="fw-bold mb-0">{c.value}</h4>
                  <span className="text-muted">{c.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMEN FINANCIERO - SOLO INGRESOS */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">💰 Flujo de Ingresos</h5>
            </div>
            <div className="card-body row text-center">
              <div className="col-md-4">
                <p className="text-muted mb-1">Ingresos por Membresías</p>
                <h4 className="text-primary">
                  {fMoneda(reporteMensual.ingresosMembresias)}
                </h4>
              </div>
              <div className="col-md-4">
                <p className="text-muted mb-1">Ventas de Productos</p>
                <h4 className="text-success">
                  {fMoneda(reporteMensual.ingresosProductos)}
                </h4>
              </div>
              <div className="col-md-4">
                <p className="text-muted mb-1">Total Ingresos</p>
                <h4 className="text-warning">
                  {fMoneda(reporteMensual.totalIngresos)}
                </h4>
              </div>
            </div>
          </div>

          {/* RESTANTE DEL CÓDIGO IGUAL */}
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white">
                  <h5 className="mb-0">🏆 Productos Más Vendidos</h5>
                </div>
                <div className="card-body">
                  {productosMasVendidos.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-sm">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Unidades</th>
                            <th>Ingresos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productosMasVendidos.map((p, i) => (
                            <tr key={i}>
                              <td>{p.nombre}</td>
                              <td>
                                <span className="badge bg-primary">
                                  {p.vendidos}
                                </span>
                              </td>
                              <td className="text-success fw-bold">
                                {fMoneda(p.ingresos)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center">No hay ventas registradas</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white">
                  <h5 className="mb-0">📦 Ventas Recientes</h5>
                </div>
                <div className="card-body">
                  {ventasRecientes.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-sm">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Método</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventasRecientes.map((v, i) => (
                            <tr key={i}>
                              <td>{fFechaHora(v.fecha_venta)}</td>
                              <td className="text-success fw-bold">
                                {fMoneda(v.total)}
                              </td>
                              <td>
                                <span className="badge bg-info">
                                  {v.metodo_pago}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center">No hay ventas recientes</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PAGOS RECIENTES */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h5 className="mb-0">💳 Pagos Recientes de Membresías</h5>
            </div>
            <div className="card-body">
              {pagosRecientes.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Valor</th>
                        <th>Cliente ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosRecientes.map((p, i) => (
                        <tr key={i}>
                          <td>{fFecha(p.fecha_pago)}</td>
                          <td className="text-success fw-bold">
                            {fMoneda(p.valor)}
                          </td>
                          <td>{p.cliente_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No hay pagos recientes</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;