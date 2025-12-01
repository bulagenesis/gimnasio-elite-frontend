// src/components/payments/PaymentModal.jsx
import React, { useEffect, useState } from "react";
import "../payments/payments.css";

const PaymentModal = ({ onClose, onSave, clientes }) => {
  const membresiasFijas = [
    { id: 1, nombre: "Día de Gimnasio", precio: 4000, duracion_meses: 0, tipo: "dia" },
    { id: 2, nombre: "Membresía Individual", precio: 55000, duracion_meses: 1, tipo: "individual" },
    { id: 3, nombre: "Promoción Dúo", precio: 100000, duracion_meses: 1, tipo: "duo" },
  ];

  const [formData, setFormData] = useState({
    cliente_id: "",
    membresia_id: "",
    monto: "",
    tipo_pago: "completo",
    fecha_pago: new Date().toISOString().split("T")[0],
    segundo_cliente_id: "",
    es_abono_inicial: false,
  });

  useEffect(() => {
    const membresia = membresiasFijas.find((m) => m.id === parseInt(formData.membresia_id));
    if (!membresia) {
      setFormData((prev) => ({ ...prev, monto: "" }));
      return;
    }

    const esDuo = membresia.tipo === "duo";
    const esIndividual = membresia.tipo === "individual";

    // Si es duo siempre pago completo y monto total
    if (esDuo) {
      setFormData((prev) => ({ ...prev, tipo_pago: "completo", monto: membresia.precio.toString(), es_abono_inicial: false }));
      return;
    }

    // Si es individual y fraccionado -> abono inicial 50%
    if (esIndividual && formData.tipo_pago === "fraccionado") {
      const abono = Math.floor(membresia.precio / 2);
      setFormData((prev) => ({ ...prev, monto: abono.toString(), es_abono_inicial: true }));
      return;
    }

    // Por defecto monto completo
    setFormData((prev) => ({ ...prev, monto: membresia.precio.toString(), es_abono_inicial: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.membresia_id, formData.tipo_pago]);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleTipoPago = (tipo) => {
    const membresia = membresiasFijas.find((m) => m.id === parseInt(formData.membresia_id));
    if (!membresia) {
      setFormData((prev) => ({ ...prev, tipo_pago: tipo }));
      return;
    }

    if (tipo === "fraccionado" && membresia.tipo === "individual") {
      const abono = Math.floor(membresia.precio / 2);
      setFormData((prev) => ({ ...prev, tipo_pago: "fraccionado", monto: abono.toString(), es_abono_inicial: true }));
      return;
    }

    setFormData((prev) => ({ ...prev, tipo_pago: tipo, monto: membresia.precio.toString(), es_abono_inicial: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.cliente_id) return alert("Selecciona un cliente");
    if (!formData.membresia_id) return alert("Selecciona una membresía");

    const sel = membresiasFijas.find((m) => m.id === parseInt(formData.membresia_id));
    const esDuo = sel?.tipo === "duo";
    if (esDuo && !formData.segundo_cliente_id) return alert("Selecciona el segundo cliente para la promoción dúo");
    if (esDuo && formData.cliente_id === formData.segundo_cliente_id) return alert("Selecciona dos clientes distintos");

    const payload = {
      cliente_id: parseInt(formData.cliente_id),
      membresia_id: parseInt(formData.membresia_id),
      monto: parseInt(formData.monto || 0),
      tipo_pago: formData.tipo_pago,
      fecha_pago: formData.fecha_pago,
      segundo_cliente_id: formData.segundo_cliente_id ? parseInt(formData.segundo_cliente_id) : null,
      es_abono_inicial: !!formData.es_abono_inicial,
    };

    onSave && onSave(payload);
  };

  const clientesDisponibles = clientes.filter((c) => c.id !== parseInt(formData.cliente_id));
  const seleccionMembresia = membresiasFijas.find((m) => m.id === parseInt(formData.membresia_id));
  const esPromocionDuo = seleccionMembresia?.tipo === "duo";
  const esMembresiaIndividual = seleccionMembresia?.tipo === "individual";
  const montoRestante = esMembresiaIndividual && formData.tipo_pago === "fraccionado"
    ? Math.floor((seleccionMembresia.precio || 0) / 2)
    : 0;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal modal-lg">
        <div className="custom-modal-header">
          <h5 className="modal-title">Registrar Pago</h5>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="custom-modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Membresía *</label>
                <select className="form-select" value={formData.membresia_id} onChange={(e) => handleChange("membresia_id", e.target.value)} required>
                  <option value="">Seleccionar membresía</option>
                  {membresiasFijas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} — ${m.precio.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Modalidad de pago *</label>
                <div>
                  <label className="radio-inline me-3">
                    <input type="radio" name="tipo_pago" checked={formData.tipo_pago === "completo"} onChange={() => handleTipoPago("completo")} disabled={esPromocionDuo} /> Pago completo
                  </label>
                  <label className="radio-inline">
                    <input type="radio" name="tipo_pago" checked={formData.tipo_pago === "fraccionado"} onChange={() => handleTipoPago("fraccionado")} disabled={!esMembresiaIndividual} /> Fraccionado
                  </label>
                </div>
                {esPromocionDuo && <small className="text-muted d-block mt-1">Promoción dúo: solo pago completo</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Primer Cliente *</label>
                <select className="form-select" value={formData.cliente_id} onChange={(e) => handleChange("cliente_id", e.target.value)} required>
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} {c.apellido} — {c.cedula}</option>
                  ))}
                </select>
              </div>

              {esPromocionDuo && (
                <div className="col-md-6">
                  <label className="form-label">Segundo Cliente *</label>
                  <select className="form-select" value={formData.segundo_cliente_id} onChange={(e) => handleChange("segundo_cliente_id", e.target.value)} required>
                    <option value="">Seleccionar segundo cliente</option>
                    {clientesDisponibles.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre} {c.apellido} — {c.cedula}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label">{formData.tipo_pago === "fraccionado" ? "Abono inicial ($)" : "Monto ($)"}</label>
                <input className="form-control" readOnly value={formData.monto ? `$${parseInt(formData.monto).toLocaleString()}` : ""} />
                <small className="text-muted d-block mt-1">
                  {formData.tipo_pago === "fraccionado"
                    ? `Abono inicial. Saldo restante: $${montoRestante.toLocaleString()} antes del día 15`
                    : "Monto completo de la membresía"}
                </small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de pago</label>
                <input type="date" className="form-control" value={formData.fecha_pago} onChange={(e) => handleChange("fecha_pago", e.target.value)} />
              </div>

              <div className="col-12">
                <div className="info-card p-3">
                  <h6 className="mb-2">📋 Información</h6>
                  {seleccionMembresia && (
                    <div className="small">
                      <div><strong>Membresía:</strong> {seleccionMembresia.nombre}</div>
                      <div><strong>Precio total:</strong> ${seleccionMembresia.precio.toLocaleString()}</div>
                      <div><strong>Duración:</strong> {seleccionMembresia.duracion_meses === 0 ? "1 día" : `${seleccionMembresia.duracion_meses} mes(es)`}</div>
                    </div>
                  )}

                  {formData.tipo_pago === "fraccionado" && (
                    <div className="alert alert-warning mt-2 mb-0">
                      <strong>Abono inicial:</strong> ${formData.monto ? parseInt(formData.monto).toLocaleString() : 0} — <strong>Saldo:</strong> ${montoRestante.toLocaleString()}
                    </div>
                  )}

                  {esPromocionDuo && (
                    <div className="alert alert-info mt-2 mb-0">
                      Promoción dúo: 2 personas — pago completo único.
                    </div>
                  )}
                </div>
              </div>

              {(formData.cliente_id || formData.segundo_cliente_id) && (
                <div className="col-12">
                  <div className="clients-selected p-3 border rounded">
                    <div className="row small">
                      {formData.cliente_id && (
                        <div className="col-md-6">
                          <strong>Cliente 1:</strong><br />
                          {clientes.find(c => c.id === parseInt(formData.cliente_id))?.nombre} {clientes.find(c => c.id === parseInt(formData.cliente_id))?.apellido}<br />
                          <small>Cédula: {clientes.find(c => c.id === parseInt(formData.cliente_id))?.cedula}</small>
                        </div>
                      )}
                      {formData.segundo_cliente_id && (
                        <div className="col-md-6">
                          <strong>Cliente 2:</strong><br />
                          {clientes.find(c => c.id === parseInt(formData.segundo_cliente_id))?.nombre} {clientes.find(c => c.id === parseInt(formData.segundo_cliente_id))?.apellido}<br />
                          <small>Cédula: {clientes.find(c => c.id === parseInt(formData.segundo_cliente_id))?.cedula}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="custom-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{formData.tipo_pago === "fraccionado" ? "Registrar Abono" : "Registrar Pago"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
