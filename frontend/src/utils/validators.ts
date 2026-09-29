export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  phone: (phone: string): boolean => {
    const clean = phone.replace(/[\s-]/g, '');
    return /^\d{8}$/.test(clean);
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  licensePlate: (plate: string): boolean => {
    const clean = plate.replace(/-/g, '').toUpperCase();

    // Particulares modernos: ABC123
    const particular = /^[A-Z]{3}\d{3}$/;

    // Particulares antiguos: 123456
    const old = /^\d{6}$/;

    // Motos: A123456 (1 letra + 6 dígitos)
    const moto = /^[A-Z]\d{6}$/;

    // Carga liviana / pesada: CL123456, B123456 (1-2 letras + 6 dígitos)
    const carga = /^[A-Z]{1,2}\d{6}$/;

    // Gobierno / institucional: G1234, SJX1234 (1-3 letras + 4 dígitos)
    const gobierno = /^[A-Z]{1,3}\d{4}$/;

    // Taxi / servicio público: TSJ123 (T + 2 letras + 3 dígitos)
    const taxi = /^T[A-Z]{2}\d{3}$/;

    // Diplomático: CD1234 (CD + 4 dígitos)
    const diplomatico = /^CD\d{4}$/;

    return (
      particular.test(clean) ||
      old.test(clean) ||
      moto.test(clean) ||
      carga.test(clean) ||
      gobierno.test(clean) ||
      taxi.test(clean) ||
      diplomatico.test(clean)
    );
  },

  futureDate: (dateString: string): boolean => {
    if (!dateString) return false;
    const parts = dateString.split('T')[0].split('-').map(Number);
    const selectedDate =
      parts.length === 3
        ? new Date(parts[0], parts[1] - 1, parts[2])
        : new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }
};

export const validateEmployee = (employee: any): { isValid: boolean; error?: string } => {
  if (!validators.required(employee.name)) {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  if (!validators.email(employee.email)) {
    return { isValid: false, error: 'Correo inválido' };
  }
  if (!validators.phone(employee.phoneNumber)) {
    return { isValid: false, error: 'Teléfono debe tener 8 dígitos' };
  }
  if (employee.idBranch === 0) {
    return { isValid: false, error: 'Selecciona una sucursal' };
  }
  if (!validators.required(employee.position)) {
    return { isValid: false, error: 'El puesto es requerido' };
  }
  return { isValid: true };
};