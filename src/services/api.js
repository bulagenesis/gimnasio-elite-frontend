// src/services/api.js
class ApiService {
  static instance = null;
  baseURL = 'http://localhost:8000';

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
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
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
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // Si no se puede parsear el error, usar el mensaje por defecto
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        console.warn('Usando datos de demostración por fallo de conexión');
        return this.getDemoData(endpoint, options.method, options.body);
      }
      
      throw error;
    }
  }

  getDemoData(endpoint, method = 'GET', body = null) {
    // Datos demo para CLIENTES
    if (endpoint === '/clientes' && method === 'GET') {
      return [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez Demo',
          cedula: '12345678',
          telefono: '3001234567',
          email: 'juan@demo.com',
          fecha_registro: '2025-11-27'
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'García Demo', 
          cedula: '87654321',
          telefono: '3007654321',
          email: 'maria@demo.com',
          fecha_registro: '2025-11-26'
        }
      ];
    }
    
    // Datos demo para PAGOS - ACTUALIZADOS con el modelo correcto
    if (endpoint === '/pagos' && method === 'GET') {
      return [
        {
          id: 1,
          cliente_id: 1,
          membresia_id: 1,
          valor: 150000,
          fecha_pago: '2025-11-27'
        },
        {
          id: 2,
          cliente_id: 2,
          membresia_id: 1,
          valor: 120000,
          fecha_pago: '2025-11-26'
        }
      ];
    }

    // Datos demo para MEMBRESIAS
    if (endpoint === '/membresias' && method === 'GET') {
      return [
        {
          id: 1,
          nombre: 'Membresía Básica',
          precio: 100000,
          duracion_dias: 30,
          descripcion: 'Acceso a áreas básicas'
        },
        {
          id: 2,
          nombre: 'Membresía Premium',
          precio: 150000,
          duracion_dias: 30,
          descripcion: 'Acceso a todas las áreas'
        }
      ];
    }
    
    if (endpoint === '/clientes' && method === 'POST') {
      const clientData = body ? JSON.parse(body) : {};
      return { 
        id: Math.floor(Math.random() * 1000), 
        message: 'Cliente creado exitosamente (demo)',
        ...clientData
      };
    }

    if (endpoint === '/pagos' && method === 'POST') {
      const pagoData = body ? JSON.parse(body) : {};
      return { 
        id: Math.floor(Math.random() * 1000),
        message: 'Pago registrado exitosamente (demo)',
        ...pagoData
      };
    }

    if (endpoint === '/membresias' && method === 'POST') {
      const membresiaData = body ? JSON.parse(body) : {};
      return { 
        id: Math.floor(Math.random() * 1000),
        message: 'Membresía creada exitosamente (demo)',
        ...membresiaData
      };
    }

    if (endpoint.includes('/clientes/') && method === 'PUT') {
      const clientData = body ? JSON.parse(body) : {};
      const id = endpoint.split('/').filter(Boolean).pop();
      return { 
        id: parseInt(id) || Math.floor(Math.random() * 1000),
        message: 'Cliente actualizado exitosamente (demo)',
        ...clientData
      };
    }

    if (endpoint.includes('/membresias/') && method === 'PUT') {
      const membresiaData = body ? JSON.parse(body) : {};
      const id = endpoint.split('/').filter(Boolean).pop();
      return { 
        id: parseInt(id) || Math.floor(Math.random() * 1000),
        message: 'Membresía actualizada exitosamente (demo)',
        ...membresiaData
      };
    }

    if (endpoint.includes('/clientes/') && method === 'DELETE') {
      return { 
        success: true,
        message: 'Cliente eliminado exitosamente (demo)'
      };
    }

    if (endpoint.includes('/pagos/') && method === 'DELETE') {
      return { 
        success: true,
        message: 'Pago eliminado exitosamente (demo)'
      };
    }

    if (endpoint.includes('/membresias/') && method === 'DELETE') {
      return { 
        success: true,
        message: 'Membresía eliminada exitosamente (demo)'
      };
    }
    
    if (endpoint.includes('/clientes/') && method === 'GET') {
      const id = endpoint.split('/').filter(Boolean).pop();
      return {
        id: parseInt(id) || 1,
        nombre: 'Cliente',
        apellido: 'Demo',
        cedula: '99999999',
        telefono: '3000000000',
        email: 'demo@demo.com',
        fecha_registro: '2025-11-27'
      };
    }

    if (endpoint.includes('/membresias/') && method === 'GET') {
      const id = endpoint.split('/').filter(Boolean).pop();
      return {
        id: parseInt(id) || 1,
        nombre: 'Membresía Demo',
        precio: 100000,
        duracion_dias: 30,
        descripcion: 'Membresía de demostración'
      };
    }
    
    return [];
  }

  // MÉTODOS PARA CLIENTES
  async getClientes() {
    return this.request('/clientes');
  }

  async createCliente(clienteData) {
    return this.request('/clientes', {
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

  // MÉTODOS PARA PAGOS - CORREGIDOS
  async getPagos() {
    return this.request('/pagos');
  }

  async createPago(pagoData) {
    return this.request('/pagos', {
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
    return this.request('/membresias');
  }

  async createMembresia(membresiaData) {
    return this.request('/membresias', {
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
}

export default ApiService.getInstance();