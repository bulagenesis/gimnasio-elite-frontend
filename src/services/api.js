// src/services/api.js

class ApiService {
	static instance = null;
	// Usar localhost:8000 para coincidir con la URL predeterminada de FastAPI/Uvicorn
	baseURL = 'https://elite-gym-lh5p.onrender.com';

	constructor() {
		if (ApiService.instance) {
			return ApiService.instance;
		}
		ApiService.instance = this;
	}

	static getInstance() {
		if (!ApiService.instance) {
			ApiService.instance = new ApiService();
		}
		return ApiService.instance;
	}

	async request(endpoint, options = {}) {
		const response = await fetch(`${this.baseURL}${endpoint}`, {
			headers: {
				// El Content-Type es crucial para que FastAPI lea el JSON
				'Content-Type': 'application/json', 
				...options.headers,
			},
			...options,
		});

		if (response.status === 204) {
			return { success: true, message: 'Operación exitosa' };
		}

		if (!response.ok) {
			let errorMessage = `Error ${response.status}: ${response.statusText}`;
			
			try {
				const errorData = await response.json();
				// Captura el detalle del error 400/422 de FastAPI
				errorMessage = errorData.detail || errorData.message || errorMessage; 
			} catch (e) {
				// Si no se puede parsear el error, usar el mensaje por defecto
			}
			
			// Lanza un error con el mensaje capturado
			throw new Error(errorMessage); 
		}

		return await response.json();
	}

	// MÉTODOS PARA CLIENTES
	async getClientes() {
		return this.request('/clientes/'); // Asegurando la barra final
	}

	async createCliente(clienteData) {
		return this.request('/clientes/', { // Asegurando la barra final
			method: 'POST',
			body: JSON.stringify({
				nombre: clienteData.nombre,
				apellido: clienteData.apellido,
				cedula: clienteData.cedula,
				telefono: clienteData.telefono,
				email: clienteData.email,
				fecha_registro: clienteData.fecha_registro || new Date().toISOString().split('T')[0]
			}),
		});
	}

	async updateCliente(id, clienteData) {
		return this.request(`/clientes/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				nombre: clienteData.nombre,
				apellido: clienteData.apellido,
				telefono: clienteData.telefono,
				email: clienteData.email,
				fecha_registro: clienteData.fecha_registro
			}),
		});
	}

	async deleteCliente(id) {
		return this.request(`/clientes/${id}`, {
			method: 'DELETE',
		});
	}

	async getClienteById(id) {
		return this.request(`/clientes/${id}`);
	}

	async getClienteByCedula(cedula) {
		return this.request(`/clientes/cedula/${cedula}`);
	}

	// MÉTODOS PARA PAGOS
	async getPagos() {
		return this.request('/pagos/');
	}

	async createPago(pagoData) {
		return this.request('/pagos/', {
			method: 'POST',
			body: JSON.stringify({
				cliente_id: parseInt(pagoData.cliente_id),
				membresia_id: parseInt(pagoData.membresia_id),
				valor: parseFloat(pagoData.valor),
				fecha_pago: pagoData.fecha_pago
			}),
		});
	}

	async deletePago(id) {
		return this.request(`/pagos/${id}`, {
			method: 'DELETE',
		});
	}

	async getPagoById(id) {
		return this.request(`/pagos/${id}`);
	}

	// MÉTODOS PARA MEMBRESIAS
	async getMembresias() {
		return this.request('/membresias/');
	}

	async createMembresia(membresiaData) {
		return this.request('/membresias/', {
			method: 'POST',
			body: JSON.stringify({
				nombre: membresiaData.nombre,
				precio: parseFloat(membresiaData.precio),
				duracion_dias: parseInt(membresiaData.duracion_dias),
				descripcion: membresiaData.descripcion
			}),
		});
	}

	async updateMembresia(id, membresiaData) {
		return this.request(`/membresias/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				nombre: membresiaData.nombre,
				precio: parseFloat(membresiaData.precio),
				duracion_dias: parseInt(membresiaData.duracion_dias),
				descripcion: membresiaData.descripcion
			}),
		});
	}

	async deleteMembresia(id) {
		return this.request(`/membresias/${id}`, {
			method: 'DELETE',
		});
	}

	async getMembresiaById(id) {
		return this.request(`/membresias/${id}`);
	}

	// MÉTODOS PARA PRODUCTOS
	async getProductos() {
		return this.request('/productos/');
	}

	async createProducto(productoData) {
		return this.request('/productos/', {
			method: 'POST',
			body: JSON.stringify({
				nombre: productoData.nombre,
				precio: parseFloat(productoData.precio),
				stock: parseInt(productoData.stock),
				categoria: productoData.categoria,
				descripcion: productoData.descripcion || ''
			}),
		});
	}

	async updateProducto(id, productoData) {
		return this.request(`/productos/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				nombre: productoData.nombre,
				precio: parseFloat(productoData.precio),
				stock: parseInt(productoData.stock),
				categoria: productoData.categoria,
				descripcion: productoData.descripcion
			}),
		});
	}

	async deleteProducto(id) {
		return this.request(`/productos/${id}`, {
			method: 'DELETE',
		});
	}

	async getProductoById(id) {
		return this.request(`/productos/${id}`);
	}

	async getProductosByCategoria(categoria) {
		return this.request(`/productos/categoria/${categoria}`);
	}

	// ✅ MÉTODOS PARA VENTAS
	async getVentas() {
		return this.request('/ventas/');
	}

	async createVenta(ventaData) {
		// 🚨 ESTE ES EL CAMBIO CLAVE: Se añade la barra final para evitar el 307 Redirect.
		return this.request('/ventas/', { 
			method: 'POST',
			body: JSON.stringify({
				productos: ventaData.productos.map(producto => ({
					producto_id: parseInt(producto.producto_id),
					cantidad: parseInt(producto.cantidad),
					precio_unitario: parseFloat(producto.precio_unitario)
				})),
				metodo_pago: ventaData.metodo_pago,
				cliente_id: ventaData.cliente_id ? parseInt(ventaData.cliente_id) : null
			}),
		});
	}

	async getVentaById(id) {
		return this.request(`/ventas/${id}`);
	}

	async getVentasByCliente(clienteId) {
		return this.request(`/ventas/cliente/${clienteId}`);
	}

	async getVentasByFecha(fecha) {
		return this.request(`/ventas/fecha/${fecha}`);
	}
}

export default ApiService.getInstance();