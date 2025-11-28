class Membresia {
  constructor(precio, descripcion, personas = 1, promocion = '') {
    this.precio = precio;
    this.descripcion = descripcion;
    this.personas = personas;
    this.promocion = promocion;
  }

  calcularTotal() {
    return this.precio;
  }

  getInfoPago() {
    return {
      precio: this.precio,
      personas: this.personas,
      promocion: this.promocion,
      permiteFraccionado: this.personas === 1
    };
  }
}

class MembresiaIndividual extends Membresia {
  constructor() {
    super(55000, 'Acceso individual ilimitado por 30 días', 1, 'Precio regular');
  }
}

class MembresiaDuo extends Membresia {
  constructor() {
    super(100000, 'Acceso para 2 personas por 30 días - PROMOCIÓN ESPECIAL', 2, 'Promoción 2x1');
  }
}

class MembresiaDia extends Membresia {
  constructor() {
    super(4000, 'Acceso por un día - Las faltas no afectan la duración', 1, 'Pago por día');
  }
}

class MembresiaFactory {
  static crearMembresia(tipo) {
    switch (tipo) {
      case 'individual':
        return new MembresiaIndividual();
      case 'duo':
        return new MembresiaDuo();
      case 'dia':
        return new MembresiaDia();
      default:
        throw new Error(`Tipo de membresía no soportado: ${tipo}`);
    }
  }

  static getOpcionesMembresias() {
    return [
      { 
        tipo: 'individual', 
        label: 'Individual', 
        instance: new MembresiaIndividual(),
        permiteFraccionado: true
      },
      { 
        tipo: 'duo', 
        label: 'Plan Dúo PROMO', 
        instance: new MembresiaDuo(),
        permiteFraccionado: false
      },
      { 
        tipo: 'dia', 
        label: 'Día', 
        instance: new MembresiaDia(),
        permiteFraccionado: false
      },
    ];
  }
}

export default MembresiaFactory;