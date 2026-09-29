import { useState } from 'react';
import { ModuleTemplate } from '../../components/templates/ModuleTemplate';
import { GenericTable } from '../../components/organisms/GenericTable';
import { ConfirmDeleteModal } from '../../components/molecules/ConfirmDeleteModal';
import { FeedbackModal } from '../../components/molecules/FeedbackModal';
import { EmployeeModal } from '../../components/molecules/EmployeeModal/EmployeeModal';
import { useEmployees } from '../../hooks/useEmployees';
import type { Employee } from '../../types/models';
import { DetailModal } from '../../components/molecules/DetailModal';

export const Empleados = () => {

  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { employees, branches, loading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const columns = [
    { header: 'Nombre', key: 'name' as keyof Employee },
    { header: 'Teléfono', key: 'phoneNumber' as keyof Employee },
    { header: 'Correo', key: 'email' as keyof Employee },
    { header: 'Puesto', key: 'position' as keyof Employee },
  ];

  const handleCreate = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleView = (employee: Employee) => {
    setViewEmployee(employee);
    setIsViewOpen(true);
  };

  const requestDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete?.idEmployee) return;

    try {
      await deleteEmployee(employeeToDelete.idEmployee);

      setFeedbackTitle('Empleado eliminado');
      setFeedbackMessage(`El empleado ${employeeToDelete.name} se eliminó correctamente.`);
      setFeedbackType('success');
    } catch (error) {
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo eliminar el empleado.');
      setFeedbackType('error');
    } finally {
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      setFeedbackOpen(true);
    }
  };

  const handleShowError = (message: string) => {
    setFeedbackTitle('Atención');
    setFeedbackMessage(message);
    setFeedbackType('error');
    setFeedbackOpen(true);
  };

  const handleSave = async (employee: Employee) => {
    try {
      if (editingEmployee?.idEmployee) {
        await updateEmployee(editingEmployee.idEmployee, employee);
        setFeedbackTitle('Empleado actualizado');
        setFeedbackMessage('El empleado se actualizó correctamente.');
        setFeedbackType('success');
      } else {
        await createEmployee(employee);
        setFeedbackTitle('Empleado creado');
        setFeedbackMessage('El empleado se creó correctamente.');
        setFeedbackType('success');
      }
      setIsModalOpen(false);
      setFeedbackOpen(true);
    } catch (error) {
      setFeedbackTitle('Error');
      setFeedbackMessage(error instanceof Error ? error.message : 'No se pudo guardar el empleado.');
      setFeedbackType('error');
      setFeedbackOpen(true);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      employee.name.toLowerCase().includes(term) ||
      employee.phoneNumber.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term) ||
      employee.position.toLowerCase().includes(term);

    const matchesBranch = selectedBranch === null || employee.idBranch === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  return (
    <>
      <ModuleTemplate title="Gestión de Empleados" buttonText="Nuevo Empleado" onAddClick={handleCreate}>

        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar empleado por nombre, teléfono, correo o puesto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={clearButtonStyle}>
                Borrar
              </button>
            )}
          </div>

          <select
            value={selectedBranch ?? ""}
            onChange={(e) => setSelectedBranch(e.target.value ? Number(e.target.value) : null)}
            style={selectStyle}
          >
            <option value="">Todas las sucursales</option>
            {branches.map((branch) => (
              <option key={branch.idBranch} value={branch.idBranch}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <GenericTable
          columns={columns}
          data={filteredEmployees}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={requestDeleteEmployee}
          onView={handleView}
        />
      </ModuleTemplate>

      {isModalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          branches={branches}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
          onShowError={handleShowError}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        message={`¿Deseas eliminar al empleado ${employeeToDelete?.name}?`}
        onConfirm={confirmDeleteEmployee}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
      />

      <FeedbackModal
        isOpen={feedbackOpen}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        duration={2500}
        onClose={() => setFeedbackOpen(false)}
      />

      <DetailModal
        isOpen={isViewOpen}
        title="Detalle de Empleado"
        data={viewEmployee}
        fields={[
          { label: "Nombre", key: "name" },
          { label: "Teléfono", key: "phoneNumber" },
          { label: "Correo", key: "email" },
          { label: "Puesto", key: "position" },
          
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewEmployee(null);
        }}
      />
    </>
  );
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  gap: "12px",
};

const searchWrapperStyle = {
  position: "relative" as const,
  width: "420px",
};

const searchInputStyle = {
  width: "100%",
  padding: "12px 40px 12px 15px",
  borderRadius: "8px",
  border: "1px solid #dcdcdc",
  fontSize: "14px",
  outline: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const clearButtonStyle = {
  position: "absolute" as const,
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#999",
};

const selectStyle = {
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #dcdcdc",
  fontSize: "14px",
  outline: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  cursor: "pointer",
  minWidth: "200px",
};