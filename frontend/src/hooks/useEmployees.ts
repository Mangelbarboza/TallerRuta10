import { useState, useEffect } from 'react';
import { employeeService } from '../services/api/employeeService';
import { branchService } from '../services/api/branchService';
import type { Employee, Branch } from '../types/models';
import { validateEmployee } from '../utils/validators';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await branchService.getAll();
      setBranches(data);
    } catch (err) {
      console.error('Error al cargar sucursales:', err);
    }
  };

  const createEmployee = async (employee: Employee) => {
    const validation = validateEmployee(employee);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    await employeeService.create(employee);
    await fetchEmployees();
  };

  const updateEmployee = async (id: number, employee: Employee) => {
    const validation = validateEmployee(employee);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    await employeeService.update(id, employee);
    await fetchEmployees();
  };

  const deleteEmployee = async (id: number) => {
    await employeeService.delete(id);
    await fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
    fetchBranches();
  }, []);

  return {
    employees,
    branches,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};