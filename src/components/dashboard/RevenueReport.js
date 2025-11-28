import React from 'react';

const RevenueReport = () => {
  // Datos de ejemplo para reporte mensual
  const reporteMensual = {
    ingresosMembresias: 3850000,
    ingresosProductos: 2840000,
    totalIngresos: 6690000,
    gastos: 1850000,
    gananciaNeta: 4840000,
    crecimiento: 15.5
  };

  const productosMasVendidos = [
    { nombre: 'Proteína Whey', vendidos: 45, ingresos: 5400000 },
    { nombre: 'Creatina', vendidos: 32, ingresos: 2560000 },
    { nombre: 'Bebida Hidratante', vendidos: 28, ingresos: 140000 },
    { nombre: 'Agua', vendidos: 25, ingresos: 75000 },
  ];

  return (
    <div className="card gym-card">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">📈 Reporte de Ganancias - Enero 2024</h5>
      </div>
      <div className="card-body">
        {/* Resumen de Ingresos */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="text-center">
              <h6 className="text-muted">Ingresos Membresías</h6>
              <h4 className="text-primary">${(reporteMensual.ingresosMembresias/1000000).toFixed(1)}M</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <h6 className="text-muted">Ingresos Productos</h6>
              <h4 className="text-success">${(reporteMensual.ingresosProductos/1000000).toFixed(1)}M</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <h6 className="text-muted">Gastos</h6>
              <h4 className="text-danger">${(reporteMensual.gastos/1000000).toFixed(1)}M</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <h6 className="text-muted">Ganancia Neta</h6>
              <h4 className="text-success">${(reporteMensual.gananciaNeta/1000000).toFixed(1)}M</h4>
              <small className="text-success">↑ {reporteMensual.crecimiento}% vs mes anterior</small>
            </div>
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <h6>🏆 Productos Más Vendidos</h6>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades Vendidas</th>
                <th>Ingresos Generados</th>
              </tr>
            </thead>
            <tbody>
              {productosMasVendidos.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.nombre}</td>
                  <td>{producto.vendidos} unidades</td>
                  <td className="text-success">${producto.ingresos.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen Final */}
        <div className="mt-3 p-3 bg-light rounded">
          <div className="row">
            <div className="col-md-6">
              <strong>Total Ingresos:</strong> ${reporteMensual.totalIngresos.toLocaleString()}
            </div>
            <div className="col-md-6">
              <strong>Ganancia Neta:</strong> 
              <span className="text-success fw-bold"> ${reporteMensual.gananciaNeta.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;